"use strict";

const requestPromise = require("request-promise");
const rison = require("rison");

const Utils = require("./utils");
const utils = new Utils();

const logger = require("../logger");

module.exports = class MatrixRestClient {
  constructor() {}

  /**
   * Sign in to Synapse server
   * @param {string} username Name of the user signing in
   * @param {string} password Password of the user signing in
   * @returns {string} Synapse access token
   */

  async login(username, password) {
    logger.logInfo("Signing in to synapse server", { username });
    const loginInfo = {
      username: username,
      password: password,
    };
    const requestOptions = utils.applyRequestOptionsFor("login", loginInfo);
    try {
      const response = await requestPromise(requestOptions);
      logger.logInfo("Sign in successful", { response });
      return response.access_token;
    } catch (err) {
      if (err.error && err.error.errcode === "M_UNKNOWN_TOKEN") {
        throw err;
      } else {
        logger.logError(err.message, {
          location: "MatrixRestClient.login",
          username,
        });
      }
    }
  }

  /**
   * Create a new chat room on Synapse server
   * @param {string} accessToken Access token of the signed in user
   * @param {string} name Name of the new room
   * @param {string[]} invite Array of users to invite
   * @returns {object} The created Room
   */

  async createRoom(accessToken, name, invites) {
    const roomDetails = {
      accessToken: accessToken,
      name: name,
    };
    if (invites) {
      const formattedInvites = utils.formatInvites(invites);
      roomDetails.invite = formattedInvites;
    } else {
      roomDetails.invite = invites;
    }
    const requestOptions = utils.applyRequestOptionsFor(
      "createRoom",
      roomDetails
    );
    try {
      return await requestPromise(requestOptions);
    } catch (err) {
      if (err.error && err.error.errcode === "M_UNKNOWN_TOKEN") {
        throw err;
      } else {
        logger.logError(err.message, {
          location: "MatrixRestClient.createRoom",
          name,
          invites,
        });
      }
    }
  }

  /**
   * Send message to a chat room on Synapse server
   * @param {string} accessToken Access token of the signed in user
   * @param {string} roomId The room id
   * @param {object} data JSON object with the key `message`
   * @returns {object} Object containing the event id of the message
   */

  async sendMessage(accessToken, roomId, data) {
    const options = {
      accessToken,
      roomId,
      data,
    };
    const requestOptions = utils.applyRequestOptionsFor(
      "sendMessage",
      options
    );
    try {
      const response = await requestPromise(requestOptions);
      logger.logInfo("Message successfully sent", { response });
      return response;
    } catch (err) {
      if (err.error && err.error.errcode === "M_UNKNOWN_TOKEN") {
        throw err;
      } else {
        logger.logError(err.message, {
          location: "MatrixRestClient.sendMessage",
          roomId,
          data,
        });
      }
    }
  }

  /**
   * Fetch all public chat rooms from Synapse server
   * @param {string} accessToken Access token of the signed in user
   * @returns {object[]} Array of room objects
   */

  async fetchPublicRooms(accessToken) {
    logger.logInfo("Fetching public rooms", {});
    const requestOptions = utils.applyRequestOptionsFor(
      "fetchPublicRooms",
      accessToken
    );
    try {
      const response = await requestPromise(requestOptions);
      logger.logInfo("Fetching public rooms successful", { response });
      return response.chunk;
    } catch (err) {
      if (err.error && err.error.errcode === "M_UNKNOWN_TOKEN") {
        throw err;
      } else {
        logger.logError(err.message, {
          location: "MatrixRestClient.fetchPublicRooms",
        });
      }
    }
  }

  /**
   * Fetch public chat room by name from Synapse server
   * @param {string} requestName Name of the room
   * @returns {object} Room object
   */

  async fetchRoomIdByName(requestName) {
    logger.logInfo("Fetching roomId by name", { requestName });
    const requestOptions = utils.applyRequestOptionsFor(
      "fetchRoomIdByName",
      requestName
    );
    try {
      const room = await requestPromise(requestOptions);
      logger.logInfo("Fetching roomId by name succesful", { room });
      return room.room_id;
    } catch (err) {
      if (err.error && err.error.errcode === "M_UNKNOWN_TOKEN") {
        throw err;
      } else {
        logger.logError(err.message, {
          location: "MatrixRestClient.fetchRoomIdByName",
          requestName,
        });
      }
    }
  }

  /**
   * Fetch all messages for multiple chat Rooms
   * @param {string} accessToken Access token of the signed in user
   * @returns {object[]} Array of Logbook objects
   */

  async fetchAllRoomsMessages(accessToken) {
    logger.logInfo("Fetching messages for all rooms", {});
    const requestOptions = utils.applyRequestOptionsFor(
      "fetchAllRoomsMessages",
      { accessToken }
    );
    try {
      const res = await requestPromise(requestOptions);
      logger.logInfo("Fetching messages for all rooms successful", {
        roomCount: Object.keys(res.rooms.join).length,
      });
      return Object.keys(res.rooms.join)
        .map(roomId => ({
          roomId,
          name: res.rooms.join[roomId].state.events
            .map(event => event.content.name)
            .pop(),
          messages: res.rooms.join[roomId].timeline.events,
        }))
        .filter(room => room.roomId && room.name && room.messages);
    } catch (err) {
      if (err.error && err.error.errcode === "M_UNKNOWN_TOKEN") {
        throw err;
      } else {
        logger.logError(err.message, {
          location: "MatrixRestClient.fetchAllRoomsMessages",
        });
      }
    }
  }

  /**
   * Fetch messages from a public chat room from Synapse server, with optional queryFilter
   * @param {string} roomId The id of the requested room
   * @param {string} accessToken Access token of the signed in user
   * @param {string} queryFilter Rison encoded object with properties: showBotMessages, showUserMessages, showImages, textSearch
   * @returns {object} Logbook object
   */

  async fetchRoomMessages(roomId, accessToken, queryFilter) {
    logger.logInfo("Fetching room messages", { roomId, queryFilter });
    const fetchOptions = {
      accessToken: accessToken,
      roomId,
    };
    if (queryFilter) {
      fetchOptions.queryFilter = rison.decode_object(queryFilter);
    }
    const requestOptions = utils.applyRequestOptionsFor(
      "fetchRoomMessages",
      fetchOptions
    );
    try {
      const res = await requestPromise(requestOptions);
      logger.logInfo("Fetching room messages successful", {
        count: Object.keys(res.rooms.join[roomId].timeline.events).length,
      });
      let messages;
      if (res.rooms.join[roomId]) {
        if (fetchOptions.queryFilter && fetchOptions.queryFilter.textSearch) {
          const pattern = new RegExp(
            ".*" + fetchOptions.queryFilter.textSearch + ".*",
            "i"
          );
          messages = res.rooms.join[roomId].timeline.events.filter(message => {
            if (message.content.hasOwnProperty("body")) {
              return message.content.body.match(pattern);
            }
          });
        } else {
          messages = res.rooms.join[roomId].timeline.events;
        }
        if (fetchOptions.queryFilter && !fetchOptions.queryFilter.showImages) {
          messages = messages.filter(message => {
            return message.content.msgtype !== "m.image";
          });
        }
      } else {
        messages = [];
      }
      return {
        roomId,
        name: res.rooms.join[roomId].state.events
          .map(event => event.content.name)
          .pop(),
        messages: messages,
      };
    } catch (err) {
      if (err.error && err.error.errcode === "M_UNKNOWN_TOKEN") {
        throw err;
      } else {
        logger.logError(err.message, {
          location: "MatrixRestClient.fetchRoomMessages",
          roomId,
          queryFilter,
        });
      }
    }
  }
};
