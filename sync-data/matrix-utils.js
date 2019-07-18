/* eslint-disable max-len */
/* eslint-disable camelcase */
'use strict';

const config = require('../server/config.local');

module.exports = class MatrixUtils {
  constructor() {
    this._host = config.synapse.host;
    this._baseUrl = `https://${config.synapse.host}:${config.synapse.port}`;
    this._accessToken =
      'MDAyMWxvY2F0aW9uIHNjaWNhdDAzLmVzc3MubHUuc2UKMDAxM2lkZW50aWZpZXIga2V5CjAwMTBjaWQgZ2VuID0gMQowMDMxY2lkIHVzZXJfaWQgPSBAc2NpY2F0Ym90OnNjaWNhdDAzLmVzc3MubHUuc2UKMDAxNmNpZCB0eXBlID0gYWNjZXNzCjAwMjFjaWQgbm9uY2UgPSBaSDJ1cDFBSj1XX1orUCsrCjAwMmZzaWduYXR1cmUgP8e0yYSkFRJTaHThqYH4xB9eNRxVnt9JgqFgU2GqPx0K';
    this._userId = `@${config.synapse.bot.name}:${config.synapse.host}`;
    this._scichatBot = `@${config.synapse.bot.name}:${config.synapse.host}`;
    this._txnCounter = 0;
  }
  eventTypeIsMessage(event) {
    if (event.type === 'm.room.message') {
      return true;
    } else {
      return false;
    }
  }

  messageTypeisImage(message) {
    if (message.content.msgtype === 'm.image') {
      return true;
    } else {
      return false;
    }
  }

  messageBodyEqualsFilename(message, filename) {
    if (message.content.body.toLowerCase() === filename.toLowerCase()) {
      return true;
    } else {
      return false;
    }
  }

  eventDateEqualsRequestDate(event, date) {
    let messageTimeStamp = new Date(event.origin_server_ts);
    messageTimeStamp.setUTCHours(0, 0, 0, 0);
    let requestDate = new Date(date);
    if (messageTimeStamp.getTime() === requestDate.getTime()) {
      return true;
    } else {
      return false;
    }
  }

  eventDateIsBetweenRequestDates(event, startDate, endDate) {
    let messageTimeStamp = new Date(event.origin_server_ts);
    messageTimeStamp.setUTCHours(0, 0, 0, 0);
    let requestStartDate = new Date(startDate);
    let requestEndDate = new Date(endDate);
    if (
      messageTimeStamp.getTime() > requestStartDate.getTime() &&
      messageTimeStamp.getTime() < requestEndDate.getTime()
    ) {
      return true;
    } else {
      return false;
    }
  }

  printFormattedMessages(messages) {
    messages.forEach(message => {
      let messageTimeStamp = new Date(message.origin_server_ts)
        .toISOString()
        .replace('T', ' ')
        .replace(/\.\w+/, '');
      console.log(
        `[${messageTimeStamp}] ${message.sender} >>> ${message.content.body}`
      );
    });
  }

  newTxnId() {
    return 's' + new Date().getTime() + '.' + this._txnCounter++;
  }

  getRequestOptionsForMethod(method, options) {
    let requestOptions = {
      headers: {
        Authorization: 'Bearer ' + this._accessToken,
      },
      rejectUnauthorized: false,
      json: true,
    };
    switch (method) {
      case 'sync': {
        requestOptions.method = 'GET';
        requestOptions.uri =
          this._baseUrl +
          '/_matrix/client/r0/sync?filter={"room":{"timeline":{"limit":100}}}';
        requestOptions.body = {
          full_state: true,
          timeout: 5000,
        };
        return requestOptions;
      }
      case 'whoAmI': {
        requestOptions.method = 'GET';
        requestOptions.uri =
          this._baseUrl + '/_matrix/client/r0/account/whoami';
        requestOptions.body = {
          timeout: 5000,
        };
        return requestOptions;
      }
      case 'login': {
        requestOptions.method = 'POST';
        requestOptions.uri = this._baseUrl + '/_matrix/client/r0/login';
        requestOptions.body = {
          type: 'm.login.password',
          identifier: {
            type: 'm.id.user',
            user: options.user,
          },
          password: options.password,
        };
        return requestOptions;
      }
      case 'findAllRooms': {
        requestOptions.method = 'GET';
        requestOptions.uri = this._baseUrl + '/_matrix/client/r0/publicRooms';
        return requestOptions;
      }
      case 'findUserInfoByUserName': {
        let userId = `@${options.toLowerCase()}:${this._host}`;
        requestOptions.method = 'GET';
        requestOptions.uri =
          this._baseUrl + `/_matrix/client/r0/profile/${userId}`;
        return requestOptions;
      }
      case 'downloadImageFromRoom': {
        requestOptions.method = 'GET';
        requestOptions.uri =
          this._baseUrl + `/_matrix/media/r0/download/${options}`;
        return requestOptions;
      }
      case 'sendMessageToRoom': {
        let txnId = this.newTxnId();
        requestOptions.method = 'PUT';
        requestOptions.uri =
          this._baseUrl +
          `/_matrix/client/r0/rooms/${
            options.roomId
          }/send/m.room.message/${txnId}`;
        if (this._userId === this._scichatBot) {
          requestOptions.body = {
            body: options.message,
            msgtype: 'm.notice',
          };
        } else {
          requestOptions.body = {
            body: options.message,
            msgtype: 'm.text',
          };
        }
        return requestOptions;
      }
      case 'findRoomMembers': {
        requestOptions.method = 'GET';
        requestOptions.uri =
          this._baseUrl + `/_matrix/client/r0/rooms/${options}/members`;
        return requestOptions;
      }
      case 'createRoom': {
        requestOptions.method = 'POST';
        requestOptions.uri = this._baseUrl + '/_matrix/client/r0/createRoom';
        requestOptions.body = {
          visibility: options.visibility,
          room_alias_name: options.room_alias_name,
          name: options.name,
          topic: options.topic,
          creation_content: {
            'm.federate': false,
          },
        };
        return requestOptions;
      }
    }
  }
};
