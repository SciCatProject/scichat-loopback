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
        return this.compareAndPostRooms(dbRooms, synapseRooms);
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
        dbEventIds = util.createDbEventIdList(dbRoomEvents);
        return this.createSynapseRoomEventMap(dbRooms);
      })
      .then(synapseRoomEvents => {
        return this.compareAndPostRoomEvents(dbEventIds, synapseRoomEvents);
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
        dbMessageIds = util.createDbMessageIdList(dbRoomMessages);
        return this.createSynapseRoomMessageMap(dbRooms);
      })
      .then(synapseRoomMessages => {
        return this.compareAndPostRoomMessages(
          dbMessageIds,
          synapseRoomMessages,
        );
      });
  }

  syncRoomMembers() {}

  compareAndPostRooms(dbRooms, synapseRooms) {
    let dbRoomIds = util.createDbRoomIdList(dbRooms);
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

  compareAndPostRoomEvents(dbEventIds, synapseRoomEvents) {
    return Promise.all(
      synapseRoomEvents.map(synapseRoomEvent => {
        return Promise.all(
          synapseRoomEvent.events.map(event => {
            if (!dbEventIds.includes(event.event_id)) {
              return lbClient.postRoomEvent(synapseRoomEvent, event);
            } else {
              return new Promise((resolve, reject) => {
                resolve({});
              });
            }
          }),
        );
      }),
    );
  }

  compareAndPostRoomMessages(dbMessageIds, synapseRoomMessages) {
    return Promise.all(
      synapseRoomMessages.map(synapseRoomMessage => {
        return Promise.all(
          synapseRoomMessage.messages.map(message => {
            if (!dbMessageIds.includes(message.event_id)) {
              return lbClient.postRoomMessage(synapseRoomMessage, message);
            } else {
              return new Promise((resolve, reject) => {
                resolve({});
              });
            }
          }),
        );
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
};
