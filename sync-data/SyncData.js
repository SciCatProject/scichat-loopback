const superagent = require('superagent');
const MatrixRestClient = require('./matrix-rest-client');
const client = new MatrixRestClient();

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
        dbEventIds = this.createDbEventIdList(dbRoomEvents);
        return this.createSynapseRoomEventMap(dbRooms);
      })
      .then(synapseRoomEvents => {
        return this.compareAndPostRoomEvents(dbEventIds, synapseRoomEvents);
      });
  }

  syncRoomMessages() {
    let dbRooms;
    let dbEventIds;

    return this.getRooms()
      .then(getRoomsResponse => {
        dbRooms = getRoomsResponse;
        return this.createDbRoomMessageMap(dbRooms);
      })
      .then(dbRoomMessages => {
        dbEventIds = this.createDbEventIdList(dbRoomMessages);
        return this.createSynapseRoomMessageMap(dbRooms);
      })
      .then(synapseRoomMessages => {
        return this.compareAndPostRoomMessages(dbEventIds, synapseRoomMessages);
      });
  }

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

  postMessage() {
    let newMessage = {
      timestamp: 0,
      sender: 'string',
      synapseEventId: 'string',
      unsigned: {},
      content: {},
      type: 'string',
    };

    return superagent
      .post(this._loopbackBaseUrl + `/${dbId}/messages`)
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
      .post(this._loopbackBaseUrl + `/${dbId}/members`)
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
      .post(this._loopbackBaseUrl + `/${dbId}/images`)
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
        rooms.forEach(room => {
          let roomMessageMap = {};
          roomMessageMap.dbId = room.id;
          roomMessageMap.roomId = room.roomId;
          roomMessageMap.name = room.name;
          synapseRoomMessages.forEach(roomMessage => {
            if (roomMessage.roomId === room.roomId) {
              roomMessageMap.messages = roomMessage.messages;
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

  replaceNonallowedObjectKeyCharacters(room, syncResponse) {
    let keys;
    syncResponse[room.roomId].timeline.events.forEach(event => {
      if (event.type === 'm.room.power_levels') {
        keys = Object.keys(event.content.users);
        for (let i = 0; i < keys.length; i++) {
          event.content.users[keys[i].replace(/[^\w\@]/g, '_')] =
            event.content.users[keys[i]];
          delete event.content.users[keys[i]];
        }
        keys = Object.keys(event.content.events);
        for (let i = 0; i < keys.length; i++) {
          event.content.events[keys[i].replace(/\W/g, '_')] =
            event.content.events[keys[i]];
          delete event.content.events[keys[i]];
        }
      } else if (event.type === 'm.room.create') {
        keys = Object.keys(event.content);
        for (let i = 0; i < keys.length; i++) {
          if (keys[i].indexOf('m.') == 0) {
            event.content[keys[i].replace(/\W/g, '_')] = event.content[keys[i]];
            delete event.content[keys[i]];
          }
        }
      }
    });
  }

  createDbEventIdList(dbRoomEvents) {
    let dbEventIds = [];
    dbRoomEvents.forEach(dbRoomEvent => {
      dbRoomEvent.events.forEach(dbEvent => {
        dbEventIds.push(dbEvent.eventId);
      });
    });
    return dbEventIds;
  }
};
