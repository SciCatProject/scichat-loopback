'use strict';

const requestPromise = require('request-promise');
const rison = require('rison');

const Utils = require('./utils');
const utils = new Utils();

module.exports = class MatrixRestClient {
  constructor() {}

  /**
   * Sign in to Synapse server
   * @param {string} username Name of the user signing in
   * @param {string} password Password of the user signing in
   * @returns {string} Synapse access token
   */

  async login(username, password) {
    let loginInfo = {
      username: username,
      password: password,
    };
    let requestOptions = utils.applyRequestOptionsFor('login', loginInfo);
    try {
      let response = await requestPromise(requestOptions);
      return response.access_token;
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Create a new chat room on Synapse server
   * @param {string} accessToken Access token of the signed in user
   * @param {object} details name: Name of the new room, topic: Topic of the ned room, invite: Array of users to invite
   * @returns {object} The created Room
   */

  async createRoom(accessToken, name, invite) {
    let roomDetails = {
      accessToken: accessToken,
      name: name,
      invite: invite,
    };
    let requestOptions = utils.applyRequestOptionsFor(
      'createRoom',
      roomDetails
    );
    try {
      return await requestPromise(requestOptions);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Fetch all public chat rooms from Synapse server
   * @param {string} accessToken Access token of the signed in user
   * @returns {object[]} Array of room objects
   */

  async fetchRooms(accessToken) {
    let requestOptions = utils.applyRequestOptionsFor(
      'fetchRooms',
      accessToken
    );
    try {
      let response = await requestPromise(requestOptions);
      return response.chunk;
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Fetch public chat room by name from Synapse server
   * @param {string} requestName Name of the room
   * @returns {object} Room object
   */

  async fetchRoomByName(requestName, accessToken) {
    try {
      let rooms = await this.fetchRooms(accessToken);
      return rooms.find(room => {
        return room.name === requestName;
      });
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Fetch all messages for multiple chat Rooms
   * @param {object[]} rooms Array of room objects
   * @returns {object[]} Array of Logbook objects
   */

  async fetchAllRoomsMessages(rooms, accessToken) {
    try {
      return await Promise.all(
        rooms.map(async room => {
          return await this.fetchRoomMessages(room, accessToken);
        })
      );
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Fetch messages from a public chat room from Synapse server, with optional queryFilter
   * @param {object} room Room object
   * @param {string} accessToken Access token of the signed in user
   * @param {string} queryFilter Rison encoded object with properties: showBotMessages, showUserMessages, showImages, textSearch
   * @returns {object} Logbook object
   */

  async fetchRoomMessages(room, accessToken, queryFilter) {
    let fetchOptions = {
      accessToken: accessToken,
      room: room,
    };
    if (queryFilter) {
      fetchOptions.queryFilter = rison.decode_object(queryFilter);
    }
    let requestOptions = utils.applyRequestOptionsFor(
      'fetchRoomMessages',
      fetchOptions
    );
    try {
      let res = await requestPromise(requestOptions);
      let messages;
      if (res.rooms.join[room.room_id]) {
        if (fetchOptions.queryFilter && fetchOptions.queryFilter.textSearch) {
          let pattern = new RegExp(
            '.*' + fetchOptions.queryFilter.textSearch + '.*',
            'i'
          );
          messages = res.rooms.join[room.room_id].timeline.events.filter(
            message => {
              if (message.content.hasOwnProperty('body')) {
                return message.content.body.match(pattern);
              }
            }
          );
        } else {
          messages = res.rooms.join[room.room_id].timeline.events;
        }
        if (fetchOptions.queryFilter && !fetchOptions.queryFilter.showImages) {
          messages = messages.filter(message => {
            return message.content.msgtype !== 'm.image';
          });
        }
      } else {
        messages = [];
      }
      return {
        roomId: room.room_id,
        name: room.name,
        messages: messages,
      };
    } catch (err) {
      console.error(err);
    }
  }
};
