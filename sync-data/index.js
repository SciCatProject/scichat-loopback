const superagent = require('superagent');
const MatrixRestClient = require('./matrix-rest-client');
const client = new MatrixRestClient();

const loopbackBaseUrl = 'http://localhost:3000';

function syncRooms() {
  let synapseRoomList;
  client
    .findAllRooms()
    .then(synapseRooms => {
      synapseRoomList = synapseRooms;
      return getRooms();
    })
    .then(dbRooms => {
      let dbRoomIds = [];
      dbRooms.forEach(dbRoom => {
        dbRoomIds.push(dbRoom.roomId);
      });
      synapseRoomList.forEach(synapseRoom => {
        if (!dbRoomIds.includes(synapseRoom.room_id)) {
          console.log('Adding new room: ' + synapseRoom.name);
          postRoom(synapseRoom);
        }
      });
    });
}

let syncResponse;

client
  .sync()
  .then(response => {
    syncResponse = response;
    return getRooms();
  })
  .then(dbRooms => {
    let dbIds = [];
    let dbRoomIds = [];
    dbRooms.forEach(dbRoom => {
      dbIds.push(dbRoom.id);
      dbRoomIds.push(dbRoom.roomId);
    });
    console.log(dbIds);
    let dbRoomEvents = [];
    dbIds.forEach(async dbId => {
      dbRoomEvents.push(await getRoomEvents(dbId));
    });
    console.log(dbRoomEvents);
  });

function postRoom(room) {
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

function postRoomEvent(room, event) {
  return superagent
    .post(loopbackBaseUrl + `/rooms/${room.id}/events`)
    .send(newEvent)
    .catch(err => {
      console.error(err);
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
