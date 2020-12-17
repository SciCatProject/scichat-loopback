/* eslint-disable camelcase */
'use strict';

module.exports = {
  loginResponse: {
    access_token: 'ABC123',
  },

  fetchRoomMessagesResponse: {
    rooms: {
      join: {
        '!testId': {
          timeline: {
            events: [
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
          state: {
            events: [
              {
                content: {
                  name: ['test'],
                },
              },
            ],
          },
        },
      },
    },
  },

  fetchPublicRoomsResponse: {
    chunk: [
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
  },

  fetchRoomIdByNameResponse: {
    room_id: 'testId',
    servers: ['test'],
  },

  createRoomResponse: {
    room_id: '!abcdef:server',
  },

  sendMessageResponse: {
    event_id: '$string',
  },

  findLogbookResponse: {
    roomId: 'testId',
    name: 'testRoom',
    messages: [],
  },

  findAllLogbooksResponse: [
    {
      roomId: 'testId',
      name: 'testRoom',
      messages: [],
    },
  ],
};
