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

let findRoomMembersResponse: any = [
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
];

let postRoomMemberResponse: any = {
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
};

let getMembersResponse: any = [
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
];

let findAllImagesByRoomResponse: any = [
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
];

let postImageResponse: any = {
  id: 'string',
  content: {},
  eventId: '$string',
  timestamp: 0,
  sender: '@string',
  type: 'm.room.message',
  unsigned: {},
  synapseRoomId: '!string',
  roomId: 'string',
};

let getImagesResponse: any = [
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
];

let findOneRoomResponse: any = {
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
  findRoomMembersResponse,
  postRoomMemberResponse,
  getMembersResponse,
  findAllImagesByRoomResponse,
  postImageResponse,
  getImagesResponse,
  findOneRoomResponse,
};
