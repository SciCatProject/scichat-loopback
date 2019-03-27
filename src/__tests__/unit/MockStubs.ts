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

let findEventsByRoomResponse: any = {
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

let findMessagesByRoomResponse: any = [
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
];

let postRoomMessageResponse: any = {
  id: 'string',
  timestamp: 0,
  sender: '@string',
  eventId: '$string',
  unsigned: {},
  content: {},
  type: 'string',
  roomId: 'string',
};

let getMessagesResponse: any = [
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
];

export {
  findAllRoomsResponse,
  findEventsByRoomResponse,
  postRoomResponse,
  emptyArray,
  emptyObject,
  getRoomsResponse,
  getEventsResponse,
  postRoomEventResponse,
  findMessagesByRoomResponse,
  postRoomMessageResponse,
  getMessagesResponse,
};
