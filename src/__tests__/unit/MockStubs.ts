let findAllRoomsResponse: any = [
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
];

let syncResponse: any = {
  next_batch: 's31_906_0_1_9_1_1_13_1',
  device_one_time_keys_count: {},
  account_data: {events: [[Object], [Object]]},
  to_device: {events: []},
  groups: {leave: {}, join: {}, invite: {}},
  presence: {events: [[Object]]},
  device_lists: {changed: [], left: []},
  rooms: {
    leave: {},
    join: {
      '!string': {
        timeline: {
          events: [
            {
              origin_server_ts: 1550743328530,
              sender: '@string',
              event_id: '$string',
              unsigned: [Object],
              state_key: '',
              content: [Object],
              type: 'm.room.join_rules',
            },
            {
              origin_server_ts: 1550743328812,
              sender: '@string',
              event_id: '$string',
              unsigned: [Object],
              state_key: '',
              content: [Object],
              type: 'm.room.history_visibility',
            },
            {
              origin_server_ts: 1550743329042,
              sender: '@string',
              event_id: '$string',
              unsigned: [Object],
              state_key: '',
              content: [Object],
              type: 'm.room.guest_access',
            },
            {
              origin_server_ts: 1550743427888,
              sender: '@string',
              event_id: '$string',
              unsigned: [Object],
              state_key: '',
              content: [Object],
              type: 'm.room.name',
            },
            {
              origin_server_ts: 1550743428087,
              sender: '@string',
              event_id: '$string',
              unsigned: [Object],
              state_key: '',
              content: [Object],
              type: 'm.room.topic',
            },
            {
              origin_server_ts: 1550743436345,
              sender: '@string',
              event_id: '$string',
              unsigned: [Object],
              state_key: '',
              content: [Object],
              type: 'm.room.canonical_alias',
            },
            {
              origin_server_ts: 1550743436382,
              sender: '@string',
              event_id: '$string',
              unsigned: [Object],
              state_key: 'string',
              content: [Object],
              type: 'm.room.aliases',
            },
            {
              origin_server_ts: 1550743462381,
              sender: '@string',
              event_id: '$string',
              unsigned: [Object],
              state_key: '',
              content: [Object],
              type: 'org.matrix.room.preview_urls',
            },
          ],
        },
      },
    },
    invite: {},
  },
};

let postRoomResponse: any = {
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
};

let emptyArray: any = [];

let emptyObject: any = {};

let getRoomsResponse: any = [
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
];

let getEventsResponse: any = [
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
];

let postRoomEventResponse: any = {
  id: 'string',
  timestamp: 0,
  sender: '@string',
  eventId: '$string',
  unsigned: {},
  stateKey: 'string',
  content: {},
  type: 'string',
  roomId: 'string',
};

export {
  findAllRoomsResponse,
  syncResponse,
  postRoomResponse,
  emptyArray,
  emptyObject,
  getRoomsResponse,
  getEventsResponse,
  postRoomEventResponse,
};
