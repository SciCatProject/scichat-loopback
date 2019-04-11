/* eslint-disable camelcase */
'use strict';

const fs = require('fs');
const request = require('request');
const requestPromise = require('request-promise');
const Utils = require('./matrix-utils');
const utils = new Utils();

module.exports = class MatrixRestClient {
  constructor() {
    this._userId = '@scicatbot:scicat03.esss.lu.se';
    this._password = 'scicatbot';
  }

  createRoom({visibility, room_alias_name, name, topic}) {
    let roomDetails = {
      visibility: visibility,
      room_alias_name: room_alias_name,
      name: name,
      topic: topic,
    };
    let options = utils.getRequestOptionsForMethod('createRoom', roomDetails);

    return requestPromise(options).catch(err => {
      console.error('Error in createRoom(): ' + err);
    });
  }

  findAllRooms() {
    let options = utils.getRequestOptionsForMethod('findAllRooms');

    return requestPromise(options)
      .then(response => {
        return Promise.resolve(response.chunk);
      })
      .catch(err => {
        console.error('Error in findAllRooms(): ' + err);
      });
  }

  findRoomByName(requestName) {
    return this.findAllRooms()
      .then(allRooms => {
        return Promise.resolve(
          allRooms.find(room => {
            return room.name.toLowerCase() === requestName.toLowerCase();
          })
        );
      })
      .catch(err => {
        console.error('Error in findRoomByName(): ' + err);
      });
  }

  findRoomMembers(roomName) {
    return this.findRoomByName(roomName)
      .then(room => {
        let options = utils.getRequestOptionsForMethod(
          'findRoomMembers',
          room.room_id
        );

        return requestPromise(options);
      })
      .then(members => {
        return Promise.resolve(members.chunk);
      })
      .catch(err => {
        console.error('Error in findRoomMemebers(): ' + err);
      });
  }

  sendMessageToRoom({roomName, message}) {
    return this.findRoomByName(roomName)
      .then(room => {
        let messageDetails = {
          roomId: room.room_id,
          message: message,
        };
        let options = utils.getRequestOptionsForMethod(
          'sendMessageToRoom',
          messageDetails
        );

        return requestPromise(options);
      })
      .catch(err => {
        console.error('Error in sendMessageToRoom(): ' + err);
      });
  }

  findEventsByRoom(roomName) {
    let roomId;
    return this.findRoomByName(roomName)
      .then(room => {
        roomId = room.room_id;
        return this.sync();
      })
      .then(syncResponse => {
        let syncRoomIds = Object.keys(syncResponse.rooms.join);
        let roomEvents = {};
        syncRoomIds.forEach(syncRoomId => {
          if (syncRoomId === roomId) {
            roomEvents.roomId = roomId;
            roomEvents.events = syncResponse.rooms.join[roomId].timeline.events;
          }
        });
        return Promise.resolve(roomEvents);
      })
      .catch(err => {
        console.error('Error in findEventsByRoom(): ' + err);
      });
  }

  findMessagesByRoom(roomName) {
    return this.findEventsByRoom(roomName)
      .then(roomEvents => {
        return Promise.all(
          roomEvents.events.filter(event => {
            return utils.eventTypeIsMessage(event);
          })
        );
      })
      .catch(err => {
        console.error('Error in findMessagesByRoom(): ' + err);
      });
  }

  findMessagesByRoomAndDate(roomName, date) {
    return this.findEventsByRoom(roomName)
      .then(roomEvents => {
        return Promise.all(
          roomEvents.events.filter(event => {
            return (
              utils.eventTypeIsMessage(event) &&
              utils.eventDateEqualsRequestDate(event, date)
            );
          })
        );
      })
      .catch(err => {
        console.error('Error in findMessagesByRoomAndDate(): ' + err);
      });
  }

  findMessagesByRoomAndDateRange(roomName, startDate, endDate) {
    return this.findEventsByRoom(roomName)
      .then(roomEvents => {
        return Promise.all(
          roomEvents.events.filter(event => {
            return (
              utils.eventTypeIsMessage(event) &&
              utils.eventDateIsBetweenRequestDates(event, startDate, endDate)
            );
          })
        );
      })
      .catch(err => {
        console.error('Error in findMessagesByRoomAndDateRange()' + err);
      });
  }

  findAllImagesByRoom(roomName) {
    return this.findMessagesByRoom(roomName).then(messages => {
      return Promise.all(
        messages.filter(message => {
          return utils.messageTypeisImage(message);
        })
      );
    });
  }

  downloadImageFromRoom(roomName, filename, savePath) {
    return this.findAllImagesByRoom(roomName)
      .then(images => {
        let foundImage = images.find(image => {
          return utils.messageBodyEqualsFilename(image, filename);
        });

        let imgUrl = foundImage.content.url.slice(6);

        let options = utils.getRequestOptionsForMethod(
          'downloadImageFromRoom',
          imgUrl
        );

        const file = fs.createWriteStream(savePath);

        return Promise.resolve(
          request(options)
            .on('error', err => {
              console.error(err);
            })
            .on('response', response => {
              response.pipe(file);
            })
            .on('complete', () => {
              return Promise.resolve(
                `File ${filename} downloaded from Room ${roomName}`
              );
            })
        );
      })
      .catch(err => {
        console.error('Error in findImageByRoomAndFilename(): ' + err);
      });
  }

  login() {
    let loginData = {
      user: this._userId,
      password: this._password,
    };
    let options = utils.getRequestOptionsForMethod('login', loginData);

    return requestPromise(options).catch(err => {
      console.error('Error in login(): ' + err);
    });
  }

  whoAmI() {
    let options = utils.getRequestOptionsForMethod('whoAmI');

    return requestPromise(options).catch(err => {
      console.error('Error in whoAmI(): ' + err);
    });
  }

  findUserInfoByUserName(userName) {
    let options = utils.getRequestOptionsForMethod(
      'findUserInfoByUserName',
      userName
    );

    return requestPromise(options).catch(err => {
      console.error('Error in findUserInfoByUserId(): ' + err);
    });
  }

  sync() {
    let options = utils.getRequestOptionsForMethod('sync');

    return requestPromise(options).catch(err => {
      console.error('Error in sync(): ' + err);
    });
  }
};
