const superagent = require('superagent');
const MatrixRestClient = require('./matrix-rest-client');
const client = new MatrixRestClient();

const loopbackBaseUrl = 'http://localhost:3000';

syncRooms();
syncRoomEvents();

function syncRooms() {
  let synapseRooms;
  client
    .findAllRooms()
    .then(allSynapseRooms => {
      synapseRooms = allSynapseRooms;
      return getRooms();
    })
    .then(dbRooms => {
      compareAndPostRooms(dbRooms, synapseRooms);
    });
}

function syncRoomEvents() {
  let syncResponse;
  client
    .sync()
    .then(response => {
      syncResponse = response.rooms.join;
      return getRooms();
    })
    .then(dbRooms => {
      let dbRoomEvents = createRoomEventMap('db', dbRooms);
      setTimeout(() => {
        let dbEventIds = createDbEventIdList(dbRoomEvents);
        let synapseRoomEvents = createRoomEventMap(
          'synapse',
          dbRooms,
          syncResponse,
        );
        compareAndPostRoomEvents(dbEventIds, synapseRoomEvents);
      }, 200);
    });
}

function postRoom(room) {
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

  superagent
    .post(loopbackBaseUrl + '/rooms')
    .send(newRoom)
    .catch(err => {
      console.error(err);
    });
}

function compareAndPostRooms(dbRooms, synapseRooms) {
  let dbRoomIds = createDbRoomIdList(dbRooms);
  synapseRooms.forEach(room => {
    if (!dbRoomIds.includes(room.room_id)) {
      postRoom(room);
    }
  });
}

function getRooms() {
  return superagent
    .get(loopbackBaseUrl + '/rooms')
    .then(response => {
      return new Promise((resolve, reject) => {
        resolve(response.body);
      });
    })
    .catch(err => {
      console.error(err);
    });
}

function postRoomEvent(dbRoomId, event) {
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
    .post(loopbackBaseUrl + `/rooms/${dbRoomId}/events`)
    .send(newEvent)
    .catch(err => {
      console.error(err);
    });
}

function compareAndPostRoomEvents(dbEventIds, synapseRoomEvents) {
  synapseRoomEvents.forEach(synapseRoomEvent => {
    synapseRoomEvent.events.forEach(event => {
      if (!dbEventIds.includes(event.event_id)) {
        console.log(
          `Adding event '${event.event_id}' to room '${synapseRoomEvent.name}'`,
        );
        postRoomEvent(synapseRoomEvent.dbId, event);
      }
    });
  });
}

function getRoomEvents(dbId) {
  return superagent
    .get(loopbackBaseUrl + `/rooms/${dbId}/events`)
    .then(response => {
      return new Promise((resolve, reject) => {
        resolve(response.body);
      });
    })
    .catch(err => {
      console.error(err);
    });
}

function createDbRoomIdList(rooms) {
  let dbRoomIds = [];
  rooms.forEach(room => {
    dbRoomIds.push(room.roomId);
  });
  return dbRoomIds;
}

function createRoomEventMap(source, rooms, syncResponse) {
  let roomEvents = [];
  rooms.forEach(async room => {
    let roomEventMap = {};
    roomEventMap.dbId = room.id;
    roomEventMap.roomId = room.roomId;
    roomEventMap.name = room.name;
    if (source === 'db') {
      roomEventMap.events = await getRoomEvents(room.dbId);
    } else if (source === 'synapse' && syncResponse) {
      replaceNonallowedObjectKeyCharacters(room, syncResponse);
      roomEventMap.events = syncResponse[room.roomId].timeline.events;
    } else {
      console.log(`Source '${source}' not recognized. Use 'db' or 'synapse'.`);
    }
    roomEvents.push(roomEventMap);
  });
  return roomEvents;
}

function replaceNonallowedObjectKeyCharacters(room, syncResponse) {
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

function createDbEventIdList(dbRoomEvents) {
  let dbEventIds = [];
  dbRoomEvents.forEach(dbRoomEvent => {
    dbRoomEvent.events.forEach(dbEvent => {
      dbEventIds.push(dbEvent.eventId);
    });
  });
  return dbEventIds;
}
