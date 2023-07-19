import { Logbook, SynapseToken } from "../models";
import { SynapseSyncResponse } from "../services";

export function givenCredentials() {
  return { username: "testUser", password: "password" };
}

export function givenSynapseLoginResponse() {
  const data = {
    user_id: "@testUser:ess",
    access_token: "123456abcdef",
    home_server: "ess",
    device_id: "edcba54321",
    well_known: {},
  };
  return new SynapseToken(data);
}

export function givenAllRoomsSyncResponse() {
  const data: SynapseSyncResponse = {
    account_data: {},
    to_device: {},
    device_lists: {},
    presence: {},
    rooms: {
      invite: {},
      join: {
        "!123456abcdef:ess": {
          timeline: {
            events: [
              {
                type: "m.room.message",
                sender: "@testUser:ess",
                senderName: "testUser",
                content: {
                  msgtype: "m.text",
                  body: "Test Logbook entry.",
                },
                origin_server_ts: 1574777701518,
                unsigned: {
                  age: 42311635499,
                },
                event_id: "$abfde12345",
              },
            ],
          },
          state: {
            events: [
              {
                type: "m.room.name",
                sender: "@testUser:ess",
                senderName: "testUser",
                content: {
                  name: "123456",
                },
                state_key: "",
                origin_server_ts: 1574777701038,
                unsigned: {
                  age: 42311635979,
                },
                event_id: "$12345abcdef",
              },
            ],
          },
          account_data: [],
          ephemeral: [],
          unread_notifications: {
            notification_count: 0,
            highlight_count: 0,
          },
          summary: {},
        },
        "!abcdef123456:ess": {
          timeline: {
            events: [
              {
                type: "m.room.message",
                sender: "@testUser:ess",
                senderName: "testUser",
                content: {
                  msgtype: "m.text",
                  body: "Another test Logbook entry.",
                },
                origin_server_ts: 1574777701518,
                unsigned: {
                  age: 42311635499,
                },
                event_id: "$ABCDE12345",
              },
            ],
          },
          state: {
            events: [
              {
                type: "m.room.name",
                sender: "@testUser:ess",
                senderName: "testUser",
                content: {
                  name: "654321",
                },
                state_key: "",
                origin_server_ts: 1574777701038,
                unsigned: {
                  age: 42311635979,
                },
                event_id: "$12345ABCDEF",
              },
            ],
          },
          account_data: [],
          ephemeral: [],
          unread_notifications: {
            notification_count: 0,
            highlight_count: 0,
          },
          summary: {},
        },
      },
      leave: {},
    },
    groups: {},
    device_one_time_keys_count: {},
    next_batch: "abc123",
  };
  return data;
}

export function givenLogbooks() {
  return [
    new Logbook({
      roomId: "!123456abcdef:ess",
      name: "123456",
      messages: [
        {
          type: "m.room.message",
          sender: "@testUser:ess",
          senderName: "testUser",
          content: {
            msgtype: "m.text",
            body: "Test Logbook entry.",
          },
          origin_server_ts: 1574777701518,
          unsigned: {
            age: 42311635499,
          },
          event_id: "$abfde12345",
        },
      ],
    }),
    new Logbook({
      roomId: "!abcdef123456:ess",
      name: "654321",
      messages: [
        {
          type: "m.room.message",
          sender: "@testUser:ess",
          senderName: "testUser",
          content: {
            msgtype: "m.text",
            body: "Another test Logbook entry.",
          },
          origin_server_ts: 1574777701518,
          unsigned: {
            age: 42311635499,
          },
          event_id: "$ABCDE12345",
        },
      ],
    }),
  ];
}

export function givenCreateRoomResponse(details: {
  name: string;
  invites?: string[];
}) {
  return {
    room_alias: `#${details.name}:ess`,
    room_id: "!abcdef123456:ess",
  };
}

export function givenFetchRoomIdByNameResponse() {
  return {
    offset: 0,
    rooms: [
      {
        canonical_alias: "string",
        name: "123456",
        room_id: "!123456abcdef:ess",
        creator: "string",
        guest_access: "string",
        history_visibility: "string",
        join_rules: "string",
        public: true,
      },
    ],
    total_rooms: 1,
  };
}

export function givenFetchRoomMessagesResponse() {
  const data: SynapseSyncResponse = {
    account_data: {},
    to_device: {},
    device_lists: {},
    presence: {},
    rooms: {
      invite: {},
      join: {
        "!123456abcdef:ess": {
          timeline: {
            events: [
              {
                type: "m.room.message",
                sender: "@testUser:ess",
                senderName: "testUser",
                content: {
                  msgtype: "m.text",
                  body: "Test Logbook entry.",
                },
                origin_server_ts: 1574777701518,
                unsigned: {
                  age: 42311635499,
                },
                event_id: "$abfde12345",
              },
            ],
          },
          state: {
            events: [
              {
                type: "m.room.name",
                sender: "@testUser:ess",
                senderName: "testUser",
                content: {
                  name: "123456",
                },
                state_key: "",
                origin_server_ts: 1574777701038,
                unsigned: {
                  age: 42311635979,
                },
                event_id: "$12345abcdef",
              },
            ],
          },
          account_data: [],
          ephemeral: [],
          unread_notifications: {
            notification_count: 0,
            highlight_count: 0,
          },
          summary: {},
        },
      },
      leave: {},
    },
    groups: {},
    device_one_time_keys_count: {},
    next_batch: "abc123",
  };

  return data;
}

export function givenLogbook() {
  return new Logbook({
    roomId: "!123456abcdef:ess",
    name: "123456",
    messages: [
      {
        type: "m.room.message",
        sender: "@testUser:ess",
        senderName: "testUser",
        content: {
          msgtype: "m.text",
          body: "Test Logbook entry.",
        },
        origin_server_ts: 1574777701518,
        unsigned: {
          age: 42311635499,
        },
        event_id: "$abfde12345",
      },
    ],
  });
}

export function givenGetMessagesWithDisplayNameResponse() {
  return [
    {
      type: "m.room.message",
      sender: "@testUser:ess",
      senderName: "testUser",
      content: {
        msgtype: "m.text",
        body: "Test Logbook entry.",
      },
      origin_server_ts: 1574777701518,
      unsigned: {
        age: 42311635499,
      },
      event_id: "$abfde12345",
    },
  ];
}
