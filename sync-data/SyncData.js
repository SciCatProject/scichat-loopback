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
    let syncResponse;
    let dbRooms;
    let dbEventIds;
    return client
      .sync()
      .then(response => {
        syncResponse = response.rooms.join;
        return this.getRooms();
      })
      .then(dbRoomList => {
        dbRooms = dbRoomList;
        let dbRoomEvents = this.createRoomEventMap('db', dbRooms);
        return new Promise((resolve, reject) => {
          resolve(dbRoomEvents);
        });
      })
      .then(dbRoomEvents => {
        dbEventIds = this.createDbEventIdList(dbRoomEvents);
        let synapseRoomEvents = this.createRoomEventMap(
          'synapse',
          dbRooms,
          syncResponse,
        );
        return new Promise((resolve, reject) => {
          resolve(synapseRoomEvents);
        });
      })
      .then(synapseRoomEvents => {
        return this.compareAndPostRoomEvents(dbEventIds, synapseRoomEvents);
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

  createDbRoomIdList(rooms) {
    let dbRoomIds = [];
    rooms.forEach(room => {
      dbRoomIds.push(room.roomId);
    });
    return dbRoomIds;
  }

  createRoomEventMap(source, rooms, syncResponse) {
    return this.getEvents().then(events => {
      let roomEvents = [];
      rooms.forEach(room => {
        let roomEventMap = {};
        roomEventMap.dbId = room.id;
        roomEventMap.roomId = room.roomId;
        roomEventMap.name = room.name;
        if (source === 'db') {
          let eventList = [];
          events.forEach(event => {
            if (event.roomId === room.id) {
              eventList.push(event);
            }
          });
          roomEventMap.events = eventList;
        } else if (source === 'synapse' && syncResponse) {
          this.replaceNonallowedObjectKeyCharacters(room, syncResponse);
          roomEventMap.events = syncResponse[room.roomId].timeline.events;
        } else {
          console.log(
            `Source '${source}' not recognized. Use 'db' or 'synapse'.`,
          );
        }
        roomEvents.push(roomEventMap);
      });
      return new Promise((resolve, reject) => {
        resolve(roomEvents);
      });
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
