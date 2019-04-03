/* eslint-disable camelcase */
'use strict';

module.exports = {
  findAllRoomsResponse: [
    {
      canonical_alias: 'string',
      name: 'string',
      world_readable: false,
      topic: 'string',
      num_joined_members: 1,
      'm.federate': false,
      room_id: '!string',
      guest_can_join: false,
      aliases: ['#string'],
    },
  ],

  findEventsByRoomResponse: {
    roomId: '!string',
    events: [
      {
        origin_server_ts: 1552488203191,
        sender: '@string',
        event_id: '$string',
        unsigned: [Object],
        state_key: '',
        content: [Object],
        type: 'm.room.canonical_alias',
      },
      {
        origin_server_ts: 1552488203239,
        sender: '@string',
        event_id: '$string',
        unsigned: [Object],
        state_key: '',
        content: [Object],
        type: 'm.room.join_rules',
      },
      {
        origin_server_ts: 1552488203297,
        sender: '@string',
        event_id: '$string',
        unsigned: [Object],
        state_key: '',
        content: [Object],
        type: 'm.room.history_visibility',
      },
    ],
  },

  postRoomResponse: {
    id: 'string',
    canonicalAlias: 'string',
    name: 'string',
    worldReadable: false,
    topic: 'string',
    numberOfJoinedMembers: 1,
    federate: false,
    roomId: '!string',
    guestCanJoin: false,
    aliases: ['#string'],
  },

  emptyArray: [],

  emptyObject: {},

  getRoomsResponse: [
    {
      id: 'string',
      canonicalAlias: 'string',
      name: 'string',
      worldReadable: false,
      topic: 'string',
      numberOfJoinedMembers: 1,
      federate: false,
      roomId: '!string',
      guestCanJoin: false,
      aliases: ['#string'],
    },
  ],

  getEventsResponse: [
    {
      id: 'string',
      timestamp: 0,
      sender: '@string',
      eventId: '$string',
      unsigned: {},
      stateKey: 'string',
      content: {},
      type: 'string',
      roomId: 'string',
    },
  ],

  postRoomEventResponse: {
    id: 'string',
    timestamp: 0,
    sender: '@string',
    eventId: '$string',
    unsigned: {},
    stateKey: 'string',
    content: {},
    type: 'string',
    roomId: 'string',
  },

  findMessagesByRoomResponse: [
    {
      origin_server_ts: 1552490651040,
      sender: '@string',
      event_id: '$string',
      unsigned: {age: 1200920499},
      content: {body: 'Hello World!', msgtype: 'm.text'},
      type: 'm.room.message',
    },
    {
      origin_server_ts: 1552644874288,
      sender: '@string',
      event_id: '$string',
      unsigned: {age: 1046697251},
      content: {body: 'Hi', msgtype: 'm.text'},
      type: 'm.room.message',
    },
  ],

  postRoomMessageResponse: {
    id: 'string',
    timestamp: 0,
    sender: '@string',
    eventId: '$string',
    unsigned: {},
    content: {},
    type: 'string',
    roomId: 'string',
  },

  getMessagesResponse: [
    {
      id: 'string',
      timestamp: 0,
      sender: '@string',
      eventId: '$string',
      unsigned: {},
      content: {},
      type: 'string',
      roomId: 'string',
    },
  ],

  findRoomMembersResponse: [
    {
      origin_server_ts: 1552644857787,
      sender: '@string',
      event_id: '$string',
      age: 1111954653,
      unsigned: {age: 1111954653},
      state_key: '@string',
      content: {
        membership: 'join',
        avatar_url: null,
        displayname: 'string',
      },
      room_id: '!string',
      user_id: '@string',
      type: 'm.room.member',
    },
  ],

  postRoomMemberResponse: {
    id: 'string',
    previousContent: {},
    timestamp: 0,
    sender: '@string',
    eventId: '$string',
    age: 0,
    unsigned: {},
    stateKey: '@string',
    content: {},
    synapseRoomId: '!string',
    userId: '@string',
    replacesState: '$string',
    type: 'm.room.member',
    roomId: 'string',
  },

  getMembersResponse: [
    {
      id: 'string',
      timestamp: 1553180922244,
      sender: '@string',
      eventId: '$string',
      age: 580661678,
      unsigned: {
        age: 580661678,
      },
      stateKey: '@string',
      content: {
        membership: 'join',
        avatar_url: 'mxc://string',
        displayname: 'string',
      },
      synapseRoomId: '!string',
      userId: '@string',
      type: 'm.room.member',
      roomId: 'string',
    },
  ],

  findAllImagesByRoomResponse: [
    {
      origin_server_ts: 1553777401018,
      sender: '@string',
      event_id: '$string',
      unsigned: {age: 492711, transaction_id: 'm1553777400954.0'},
      content: {
        body: 'image.png',
        info: [Object],
        msgtype: 'm.image',
        url: 'mxc://string',
      },
      type: 'm.room.message',
    },
  ],

  postImageResponse: {
    id: 'string',
    content: {},
    eventId: '$string',
    timestamp: 0,
    sender: '@string',
    type: 'm.room.message',
    unsigned: {},
    synapseRoomId: '!string',
    roomId: 'string',
  },

  getImagesResponse: [
    {
      id: 'string',
      content: {},
      eventId: '$string',
      timestamp: 0,
      sender: '@string',
      type: 'm.room.message',
      unsigned: {},
      synapseRoomId: '!string',
      roomId: 'string',
    },
  ],

  findOneRoomResponse: {
    id: 'string',
    canonicalAlias: 'string',
    name: 'string',
    worldReadable: false,
    topic: 'string',
    numberOfJoinedMembers: 1,
    federate: false,
    roomId: '!string',
    guestCanJoin: false,
    aliases: ['#string'],
  },
};
