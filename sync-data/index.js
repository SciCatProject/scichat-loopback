const superagent = require('superagent');
const MatrixRestClient = require('./matrix-rest-client');
const client = new MatrixRestClient();

const loopbackBaseUrl = 'http://localhost:3000';

client.findAllRooms().then(synapseRooms => {
  getRooms().then(rooms => {
    if (rooms.length === 0) {
      synapseRooms.forEach(synapseRoom => {
        console.log('Adding new room: ' + synapseRoom.name);
        addRoom(synapseRoom);
      });
    } else {
      synapseRooms.forEach(synapseRoom => {
        rooms.forEach(room => {
          if (synapseRoom.room_id !== room.roomId) {
            console.log('Adding new room: ' + synapseRoom.name);
            addRoom(synapseRoom);
          }
        });
      });
    }
  });
});

function addRoom(room) {
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
