const superagent = require('superagent');

module.exports = class LoopbackClient {
  constructor() {
    this._loopbackBaseUrl = 'http://localhost:3000';
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
      `Adding message '${message.event_id}' to room '${
        synapseRoomMessage.name
      }'`,
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

  postRoomMember(synapseRoomMember, member) {
    console.log(
      `Adding member '${member.event_id}' to room '${synapseRoomMember.name}'`,
    );
    let newMember = {
      previousContent: member.prev_content,
      timestamp: member.origin_server_ts,
      sender: member.sender,
      eventId: member.event_id,
      age: member.age,
      unsigned: member.unsigned,
      stateKey: member.state_key,
      content: member.content,
      synapseRoomId: member.room_id,
      userId: member.user_id,
      replacesState: member.replaces_state,
      type: member.type,
    };

    return superagent
      .post(this._loopbackBaseUrl + `/rooms/${synapseRoomMember.dbId}/members`)
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

  postRoomImage() {
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
};
