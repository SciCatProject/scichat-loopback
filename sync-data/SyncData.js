const superagent = require('superagent');
const MatrixRestClient = require('./matrix-rest-client');
const client = new MatrixRestClient();
const Utils = require('./Utils');
const util = new Utils();

module.exports = class SyncData {
  constructor() {
    this._loopbackBaseUrl = 'http://localhost:3000';
  }

  syncRooms() {
    let synapseRooms;
    return client
      .findAllRooms()
      .then(allSynapseRooms => {
        synapseRooms = allSynapseRooms;
        return this.getRooms();
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

    return this.getRooms()
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

    return this.getRooms()
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

  postRoom(room) {
    console.log('Adding new room: ' + room.name);
    let newRoom = {
      canonicalAlias: room.canonical_alias,
      name: room.name,
      worldReadable: room.world_readable,
      topic: room.topic,
      numberOfJoinedMembers: room.num_joined_members,
      federate: room['m.federate'],
      roomId: room.room_id,
      guestCanJoin: room.guest_can_join,
      aliases: room.aliases,
    };

    return superagent
      .post(this._loopbackBaseUrl + '/rooms')
      .send(newRoom)
      .then(response => {
        return new Promise((resolve, reject) => {
          resolve(response.body);
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  compareAndPostRooms(dbRooms, synapseRooms) {
    let dbRoomIds = this.createDbRoomIdList(dbRooms);
    return Promise.all(
      synapseRooms.map(room => {
        if (!dbRoomIds.includes(room.room_id)) {
          return this.postRoom(room);
        } else {
          return new Promise((resolve, reject) => {
            resolve({});
          });
        }
      }),
    );
  }

  getRooms() {
    return superagent
      .get(this._loopbackBaseUrl + '/rooms')
      .then(response => {
        return new Promise((resolve, reject) => {
          resolve(response.body);
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  postRoomEvent(synapseRoomEvent, event) {
    console.log(
      `Adding event '${event.event_id}' to room '${synapseRoomEvent.name}'`,
    );
    let newEvent = {
      timestamp: event.origin_server_ts,
      sender: event.sender,
      eventId: event.event_id,
      unsigned: event.unsigned,
      stateKey: event.state_key,
      content: event.content,
      type: event.type,
    };
    return superagent
      .post(this._loopbackBaseUrl + `/rooms/${synapseRoomEvent.dbId}/events`)
      .send(newEvent)
      .then(response => {
        return new Promise((resolve, reject) => {
          resolve(response.body);
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  compareAndPostRoomEvents(dbEventIds, synapseRoomEvents) {
    return Promise.all(
      synapseRoomEvents.map(synapseRoomEvent => {
        return Promise.all(
          synapseRoomEvent.events.map(event => {
            if (!dbEventIds.includes(event.event_id)) {
              return this.postRoomEvent(synapseRoomEvent, event);
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

  getEvents() {
    return superagent
      .get(this._loopbackBaseUrl + '/events')
      .then(response => {
        return new Promise((resolve, reject) => {
          resolve(response.body);
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  postRoomMessage(synapseRoomMessage, message) {
    console.log(
      `Adding event '${message.event_id}' to room '${synapseRoomMessage.name}'`,
    );
    let newMessage = {
      timestamp: message.origin_server_ts,
      sender: message.sender,
      eventId: message.event_id,
      unsigned: message.unsigned,
      content: message.content,
      type: message.type,
    };

    return superagent
      .post(
        this._loopbackBaseUrl + `/rooms/${synapseRoomMessage.dbId}/messages`,
      )
      .send(newMessage)
      .then(response => {
        return new Promise((resolve, reject) => {
          resolve(response.body);
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  compareAndPostRoomMessages(dbMessageIds, synapseRoomMessages) {
    return Promise.all(
      synapseRoomMessages.map(synapseRoomMessage => {
        return Promise.all(
          synapseRoomMessage.messages.map(message => {
            if (!dbMessageIds.includes(message.event_id)) {
              return this.postRoomMessage(synapseRoomMessage, message);
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

  getMessages() {
    return superagent
      .get(this._loopbackBaseUrl + '/messages')
      .then(response => {
        return new Promise((resolve, reject) => {
          resolve(response.body);
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  postMember() {
    let newMember = {
      previousContent: {},
      timestamp: 0,
      sender: 'string',
      eventId: 'string',
      age: 0,
      unsigned: {},
      stateKey: 'string',
      content: {},
      synapseRoomId: 'string',
      userId: 'string',
      replacesState: 'string',
      type: 'string',
    };

    return superagent
      .post(this._loopbackBaseUrl + `/rooms/${dbId}/members`)
      .send(newMember)
      .then(response => {
        return new Promise((resolve, reject) => {
          resolve(response.body);
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  getMembers() {
    return superagent
      .get(this._loopbackBaseUrl + '/members')
      .then(response => {
        return new Promise((resolve, reject) => {
          resolve(response.body);
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  postImage() {
    let newImage = {
      content: {},
      synapseEventId: 'string',
      timestamp: 0,
      sender: 'string',
      type: 'string',
      unsigned: {},
      synapseRoomId: 'string',
    };

    return superagent
      .post(this._loopbackBaseUrl + `/rooms/${dbId}/images`)
      .send(newImage)
      .then(response => {
        return new Promise((resolve, reject) => {
          resolve(response.body);
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  getImages() {
    return superagent
      .get(this._loopbackBaseUrl + '/images')
      .then(response => {
        return new Promise((resolve, reject) => {
          resolve(response.body);
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  createDbRoomIdList(rooms) {
    let dbRoomIds = [];
    rooms.forEach(room => {
      dbRoomIds.push(room.roomId);
    });
    return dbRoomIds;
  }

  createDbRoomEventMap(rooms) {
    return this.getEvents()
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
        return client.findEventsByRoom(room.name);
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
    return this.getMessages()
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
        return client.findMessagesByRoom(room.name);
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
