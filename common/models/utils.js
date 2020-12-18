/* eslint-disable camelcase */
'use strict';

const configs = require('../../server/config.local');

module.exports = class Utils {
  constructor() {
    this.serverName = configs.synapse.name;
    this.serverHost = configs.synapse.host;
    this.serverPort = configs.synapse.port;
    if (this.serverHost) {
      if (this.serverPort) {
        this.baseUrl = `${this.serverHost}:${this.serverPort}`;
      } else {
        this.baseUrl = this.serverHost;
      }
    }
    console.log('Synapse url: ', this.baseUrl);
    this.user = configs.synapse.bot.name;
  }

  /**
   * Creates an object containing options for requests to Synapse server
   * @param {string[]} invites Array of users to invite, e.g., ["firstnamelastname"]
   * @returns {string[]} Array of Synapse formatted users
   */

  formatInvites(invites) {
    const formattedInvites = invites.map(invite => {
      if (!invite.startsWith('@') && invite.indexOf(':') < 0) {
        return '@' + invite + ':' + this.serverName;
      } else {
        return invite;
      }
    });
    return formattedInvites;
  }

  /**
   * Creates an object containing options for requests to Synapse server
   * @param {string} type Name of the method calling this method
   * @param {object} options Object containing additional request options
   * @returns {object} Request options object
   */

  applyRequestOptionsFor(type, options) {
    const requestOptions = {
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
      case 'createRoom': {
        requestOptions.headers = {
          Authorization: 'Bearer ' + options.accessToken,
        };
        requestOptions.method = 'POST';
        requestOptions.uri = requestOptions.uri.concat(
          '/_matrix/client/r0/createRoom'
        );
        requestOptions.body = {
          visibility: 'private',
          room_alias_name: options.name,
          name: options.name,
          topic: `Logbook for proposal ${options.name}`,
          creation_content: {
            'm.federate': false,
          },
          power_level_content_override: {
            state_key: '',
            invite: 100,
          },
        };
        if (options.invite) {
          requestOptions.body.invite = options.invite;
        }
        return requestOptions;
      }
      case 'sendMessage': {
        requestOptions.headers = {
          Authorization: 'Bearer ' + options.accessToken,
        };
        requestOptions.method = 'POST';
        requestOptions.uri = requestOptions.uri.concat(
          '/_matrix/client/r0/rooms/',
          encodeURIComponent(options.roomId),
          '/send/m.room.message'
        );
        requestOptions.body = {
          msgtype: 'm.text',
          body: options.data.message,
        };
        return requestOptions;
      }
      case 'fetchPublicRooms': {
        requestOptions.headers = {Authorization: 'Bearer ' + options};
        requestOptions.method = 'GET';
        requestOptions.uri = requestOptions.uri.concat(
          '/_matrix/client/r0/publicRooms'
        );
        return requestOptions;
      }
      case 'fetchRoomIdByName': {
        requestOptions.method = 'GET';
        requestOptions.uri = requestOptions.uri.concat(
          '/_matrix/client/r0/directory/room/',
          encodeURIComponent(`#${options}:${this.serverName}`)
        );
        return requestOptions;
      }
      case 'fetchAllRoomsMessages':
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
    const filter = {
      account_data: {not_types: ['m.*', 'im.*']},
      presence: {not_types: ['*']},
      room: {
        state: {types: ['m.room.name']},
        timeline: {
          limit: 1000000,
          types: ['m.room.message'],
        },
      },
    };
    if (options.roomId) {
      filter.room.rooms = [options.roomId];
    }
    if (options.queryFilter && !options.queryFilter.showBotMessages) {
      filter.room.timeline.not_senders = [`@${this.user}:${this.serverName}`];
    }
    if (options.queryFilter && !options.queryFilter.showUserMessages) {
      filter.room.timeline.senders = [`@${this.user}:${this.serverName}`];
    }

    return JSON.stringify(filter);
  }
};
