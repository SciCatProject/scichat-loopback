/* eslint-disable camelcase */
'use strict';

module.exports = {
  loginResponse: 'ABC123',

  fetchAllRoomsMessagesResponse: [
    {
      roomId: '!string',
      name: 'string',
      messages: [
        {
          origin_server_ts: 1552488203191,
          sender: '@string',
          event_id: '$string',
          unsigned: [Object],
          state_key: '',
          content: [Object],
          type: 'm.room.message',
        },
        {
          origin_server_ts: 1552488203239,
          sender: '@string',
          event_id: '$string',
          unsigned: [Object],
          state_key: '',
          content: [Object],
          type: 'm.room.message',
        },
        {
          origin_server_ts: 1552488203297,
          sender: '@string',
          event_id: '$string',
          unsigned: [Object],
          state_key: '',
          content: [Object],
          type: 'm.room.message',
        },
      ],
    },
  ],

  fetchRoomMessagesResponse: {
    roomId: '!string',
    name: 'string',
    messages: [
      {
        origin_server_ts: 1552488203191,
        sender: '@string',
        event_id: '$string',
        unsigned: [Object],
        state_key: '',
        content: [Object],
        type: 'm.room.message',
      },
      {
        origin_server_ts: 1552488203239,
        sender: '@string',
        event_id: '$string',
        unsigned: [Object],
        state_key: '',
        content: [Object],
        type: 'm.room.message',
      },
      {
        origin_server_ts: 1552488203297,
        sender: '@string',
        event_id: '$string',
        unsigned: [Object],
        state_key: '',
        content: [Object],
        type: 'm.room.message',
      },
    ],
  },

  fetchRoomsResponse: [
    {
      canonical_alias: 'string',
      name: '23PTEG',
      world_readable: false,
      topic: 'string',
      num_joined_members: 3,
      'm.federate': false,
      room_id: '!string',
      guest_can_join: false,
      aliases: ['#string'],
    },
  ],

  fetchRoomByNameResponse: {
    canonical_alias: 'string',
    name: '23PTEG',
    world_readable: false,
    topic: 'string',
    num_joined_members: 3,
    'm.federate': false,
    room_id: '!string',
    guest_can_join: false,
    aliases: ['#string'],
  },
};
