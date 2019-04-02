const MatrixRestClient = require('./matrix-rest-client');
const matrixClient = new MatrixRestClient();
const LoopbackClient = require('./LoopbackClient');
const lbClient = new LoopbackClient();
const Utils = require('./Utils');
const util = new Utils();

module.exports = class SyncData {
  constructor() {}

  syncRooms() {
    let synapseRooms;
    return matrixClient
      .findAllRooms()
      .then(allSynapseRooms => {
        synapseRooms = allSynapseRooms;
        return lbClient.getRooms();
      })
      .then(dbRooms => {
        return this.postRooms(dbRooms, synapseRooms);
      })
      .catch(err => {
        console.error(err);
      });
  }

  syncRoomEvents() {
    let dbRooms;
    let dbEventIds;

    return lbClient
      .getRooms()
      .then(getRoomsResponse => {
        dbRooms = getRoomsResponse;
        return this.createDbRoomEventMap(dbRooms);
      })
      .then(dbRoomEvents => {
        dbEventIds = util.createIdList('event', dbRoomEvents);
        // console.log(dbEventIds);
        return this.createSynapseRoomEventMap(dbRooms);
      })
      .then(synapseRoomEvents => {
        // return util.createEventIdList(dbRooms);
        return this.postToRoom('event', dbEventIds, synapseRoomEvents);
      })
      .catch(err => {
        console.error(err);
      });
  }

  syncRoomMessages() {
    let dbRooms;
    let dbMessageIds;

    return lbClient
      .getRooms()
      .then(getRoomsResponse => {
        dbRooms = getRoomsResponse;
        return this.createDbRoomMessageMap(dbRooms);
      })
      .then(dbRoomMessages => {
        dbMessageIds = util.createIdList('message', dbRoomMessages);
        return this.createSynapseRoomMessageMap(dbRooms);
      })
      .then(synapseRoomMessages => {
        return this.postToRoom('message', dbMessageIds, synapseRoomMessages);
      })
      .catch(err => {
        console.error(err);
      });
  }

  syncRoomMembers() {
    let dbRooms;
    let dbMemberIds;

    return lbClient
      .getRooms()
      .then(getRoomsResponse => {
        dbRooms = getRoomsResponse;
        return this.createDbRoomMemberMap(dbRooms);
      })
      .then(dbRoomMembers => {
        dbMemberIds = util.createIdList('member', dbRoomMembers);
        return this.createSynapseRoomMemberMap(dbRooms);
      })
      .then(synapseRoomMembers => {
        return this.postToRoom('member', dbMemberIds, synapseRoomMembers);
      })
      .catch(err => {
        console.error(err);
      });
  }

  syncRoomImages() {
    let dbRooms;
    let dbImagesIds;

    return lbClient
      .getRooms()
      .then(getRoomsResponse => {
        dbRooms = getRoomsResponse;
        return this.createDbRoomImageMap(dbRooms);
      })
      .then(dbRoomImages => {
        dbImagesIds = util.createIdList('image', dbRoomImages);
        return this.createSynapseRoomImageMap(dbRooms);
      })
      .then(synapseRoomImages => {
        return this.postToRoom('image', dbImagesIds, synapseRoomImages);
      })
      .catch(err => {
        console.error(err);
      });
  }

  postRooms(dbRooms, synapseRooms) {
    let dbRoomIds = util.createIdList('room', dbRooms);
    return Promise.all(
      synapseRooms.map(room => {
        if (!dbRoomIds.includes(room.room_id)) {
          return lbClient.postRoom(room);
        } else {
          return new Promise((resolve, reject) => {
            resolve({});
          });
        }
      }),
    );
  }

  postToRoom(type, IdList, synapseMap) {
    return Promise.all(
      synapseMap.map(mapElements => {
        switch (type) {
          case 'event': {
            return Promise.all(
              mapElements.events.map(event => {
                if (!IdList.includes(event.event_id)) {
                  return lbClient.postRoomEvent(mapElements, event);
                } else {
                  return new Promise((resolve, reject) => {
                    resolve({});
                  });
                }
              }),
            );
          }
          case 'message': {
            return Promise.all(
              mapElements.messages.map(message => {
                if (!IdList.includes(message.event_id)) {
                  return lbClient.postRoomMessage(mapElements, message);
                } else {
                  return new Promise((resolve, reject) => {
                    resolve({});
                  });
                }
              }),
            );
          }
          case 'member': {
            return Promise.all(
              mapElements.members.map(member => {
                if (!IdList.includes(member.event_id)) {
                  return lbClient.postRoomMember(mapElements, member);
                } else {
                  return new Promise((resolve, reject) => {
                    resolve({});
                  });
                }
              }),
            );
          }
          case 'image': {
            return Promise.all(
              mapElements.images.map(image => {
                if (!IdList.includes(image.event_id)) {
                  return lbClient.postRoomImage(mapElements, image);
                } else {
                  return new Promise((resolve, reject) => {
                    resolve({});
                  });
                }
              }),
            );
          }
        }
      }),
    );
  }

  createDbRoomEventMap(rooms) {
    return lbClient
      .getEvents()
      .then(events => {
        let roomEvents = rooms.map(room => {
          let roomEventMap = {};
          roomEventMap.dbId = room.id;
          roomEventMap.roomId = room.roomId;
          roomEventMap.name = room.name;
          roomEventMap.events = events.filter(event => {
            return event.roomId === room.id;
          });
          return roomEventMap;
        });
        return new Promise((resolve, reject) => {
          resolve(roomEvents);
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  createSynapseRoomEventMap(rooms) {
    return Promise.all(
      rooms.map(room => {
        return matrixClient.findEventsByRoom(room.name);
      }),
    )
      .then(synapseRoomEvents => {
        let roomEvents = [];
        rooms.forEach(room => {
          let roomEventMap = {};
          roomEventMap.dbId = room.id;
          roomEventMap.roomId = room.roomId;
          roomEventMap.name = room.name;
          synapseRoomEvents.forEach(roomEvent => {
            if (roomEvent.roomId === room.roomId) {
              util.replaceNonallowedObjectKeyCharacters(roomEvent.events);
              roomEventMap.events = roomEvent.events;
            }
          });
          roomEvents.push(roomEventMap);
        });
        return new Promise((resolve, reject) => {
          resolve(roomEvents);
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  createDbRoomMessageMap(rooms) {
    return lbClient
      .getMessages()
      .then(messages => {
        let roomMessages = rooms.map(room => {
          let roomMessageMap = {};
          roomMessageMap.dbId = room.id;
          roomMessageMap.roomId = room.roomId;
          roomMessageMap.name = room.name;
          roomMessageMap.messages = messages.filter(message => {
            return message.roomId === room.id;
          });
          return roomMessageMap;
        });
        return new Promise((resolve, reject) => {
          resolve(roomMessages);
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  createSynapseRoomMessageMap(rooms) {
    return Promise.all(
      rooms.map(room => {
        return matrixClient.findMessagesByRoom(room.name);
      }),
    )
      .then(synapseRoomMessages => {
        let roomMessages = [];
        for (let i = 0; i < rooms.length; i++) {
          let roomMessageMap = {};
          roomMessageMap.dbId = rooms[i].id;
          roomMessageMap.roomId = rooms[i].roomId;
          roomMessageMap.name = rooms[i].name;
          roomMessageMap.messages = synapseRoomMessages[i];
          roomMessages.push(roomMessageMap);
        }
        return new Promise((resolve, reject) => {
          resolve(roomMessages);
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  createDbRoomMemberMap(rooms) {
    return lbClient
      .getMembers()
      .then(members => {
        let roomMembers = rooms.map(room => {
          let roomMemberMap = {};
          roomMemberMap.dbId = room.id;
          roomMemberMap.roomId = room.roomId;
          roomMemberMap.name = room.name;
          roomMemberMap.members = members.filter(member => {
            return member.roomId === room.id;
          });
          return roomMemberMap;
        });
        return new Promise((resolve, reject) => {
          resolve(roomMembers);
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  createSynapseRoomMemberMap(rooms) {
    return Promise.all(
      rooms.map(room => {
        return matrixClient.findRoomMembers(room.name);
      }),
    )
      .then(synapseRoomMembers => {
        let roomMembers = [];
        for (let i = 0; i < rooms.length; i++) {
          let roomMemberMap = {};
          roomMemberMap.dbId = rooms[i].id;
          roomMemberMap.roomId = rooms[i].roomId;
          roomMemberMap.name = rooms[i].name;
          roomMemberMap.members = synapseRoomMembers[i];
          roomMembers.push(roomMemberMap);
        }
        return new Promise((resolve, reject) => {
          resolve(roomMembers);
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  createDbRoomImageMap(rooms) {
    return lbClient
      .getImages()
      .then(images => {
        let roomImages = rooms.map(room => {
          let roomImageMap = {};
          roomImageMap.dbId = room.id;
          roomImageMap.roomId = room.roomId;
          roomImageMap.name = room.name;
          roomImageMap.images = images.filter(image => {
            return image.roomId === room.id;
          });
          return roomImageMap;
        });
        return new Promise((resolve, reject) => {
          resolve(roomImages);
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  createSynapseRoomImageMap(rooms) {
    return Promise.all(
      rooms.map(room => {
        return matrixClient.findAllImagesByRoom(room.name);
      }),
    )
      .then(synapseRoomImages => {
        let roomImages = [];
        for (let i = 0; i < rooms.length; i++) {
          let roomImageMap = {};
          roomImageMap.dbId = rooms[i].id;
          roomImageMap.roomId = rooms[i].roomId;
          roomImageMap.name = rooms[i].name;
          roomImageMap.images = synapseRoomImages[i];
          roomImages.push(roomImageMap);
        }
        return new Promise((resolve, reject) => {
          resolve(roomImages);
        });
      })
      .catch(err => {
        console.error(err);
      });
  }
};
