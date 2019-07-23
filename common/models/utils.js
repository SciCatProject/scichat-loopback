/* eslint-disable camelcase */
'use strict';

const configs = require('../../server/config.local');

module.exports = class Utils {
  constructor() {
    this.serverName = configs.synapse.host;
    this.serverPort = configs.synapse.port;
    this.baseUrl = `https://${this.serverName}:${this.serverPort}`;
    this.user = configs.synapse.bot.name;
  }

  /**
   * Creates an object containing options for requests to Synapse server
   * @param {string} type Name of the method calling this method
   * @param {object} options Object containing additional request options
   * @returns {object} Request options object
   */

  applyRequestOptionsFor(type, options) {
    let requestOptions = {
      uri: this.baseUrl,
      rejectUnauthorized: false,
      json: true,
    };
    switch (type) {
      case 'login': {
        requestOptions.method = 'POST';
        requestOptions.uri = requestOptions.uri.concat(
          '/_matrix/client/r0/login'
        );
        requestOptions.body = {
          type: 'm.login.password',
          identifier: {
            type: 'm.id.user',
            user: options.username,
          },
          password: options.password,
        };
        return requestOptions;
      }
      case 'postRoom': {
        requestOptions.headers = {
          Authorization: 'Bearer ' + options.accessToken,
        };
        requestOptions.method = 'POST';
        requestOptions.uri = requestOptions.uri.concat(
          '/_matrix/client/r0/createRoom'
        );
        requestOptions.body = {
          visibility: 'public',
          room_alias_name: options.name,
          name: options.name,
          topic: options.topic,
          invite: options.invite,
          creation_content: {
            'm.federate': false,
          },
          power_level_content_override: {
            state_key: '',
            invite: 100,
          },
        };
      }
      case 'fetchRooms': {
        requestOptions.headers = {Authorization: 'Bearer ' + options};
        requestOptions.method = 'GET';
        requestOptions.uri = requestOptions.uri.concat(
          '/_matrix/client/r0/publicRooms'
        );
        return requestOptions;
      }
      case 'fetchRoomMessages': {
        requestOptions.headers = {
          Authorization: 'Bearer ' + options.accessToken,
        };
        requestOptions.method = 'GET';
        requestOptions.uri = requestOptions.uri.concat(
          '/_matrix/client/r0/sync',
          '?filter=',
          this.applyFilter(options)
        );
        return requestOptions;
      }
    }
  }

  /**
   * Builds a filter used for fetching messages from Synapse server
   * @param {object} options Object containing a room object and a query filter object
   * @returns {string} Stringified JSON object
   */

  applyFilter(options) {
    let filter = {
      account_data: {not_types: ['m.*', 'im.*']},
      room: {
        rooms: [options.room.room_id],
        state: {not_types: ['m.room.*']},
        timeline: {
          limit: 100,
          types: ['m.room.message'],
        },
      },
    };
    if (options.queryFilter && !options.queryFilter.showBotMessages) {
      filter.room.timeline.not_senders = [`@${this.user}:${this.serverName}`];
    }
    if (options.queryFilter && !options.queryFilter.showUserMessages) {
      filter.room.timeline.senders = [`@${this.user}:${this.serverName}`];
    }

    return JSON.stringify(filter);
  }
};
