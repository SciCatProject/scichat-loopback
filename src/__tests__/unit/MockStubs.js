module.exports = {
  findAllRoomsResponse = [
    {
      canonical_alias: '#ERIC:scicat03.esss.lu.se',
      name: 'ERIC',
      world_readable: false,
      topic: 'Chat log for ESS ERIC',
      num_joined_members: 2,
      'm.federate': false,
      room_id: '!MuqtjGUIpjdcDgtDtv:scicat03.esss.lu.se',
      guest_can_join: false,
      aliases: [ '#ERIC:scicat03.esss.lu.se' ]
    },
    {
      canonical_alias: '#Proposal01:scicat03.esss.lu.se',
      name: 'Proposal01',
      world_readable: false,
      topic: 'Logbook for Proposal01',
      num_joined_members: 1,
      'm.federate': false,
      room_id: '!egqxdtaULWuaqnbAJe:scicat03.esss.lu.se',
      guest_can_join: false,
      aliases: [ '#Proposal01:scicat03.esss.lu.se' ]
    },
    {
      canonical_alias: '#Proposal02:scicat03.esss.lu.se',
      name: 'Proposal02',
      world_readable: false,
      topic: 'Logbook for Proposal02',
      num_joined_members: 1,
      'm.federate': false,
      room_id: '!hedJnkXsgKVYxLJbal:scicat03.esss.lu.se',
      guest_can_join: false,
      aliases: [ '#Proposal02:scicat03.esss.lu.se' ]
    }
  ],
  syncResponse: {
    next_batch: "s31_906_0_1_9_1_1_13_1",
    device_one_time_keys_count: {},
    account_data: { events: [[Object], [Object]] },
    to_device: { events: [] },
    groups: { leave: {}, join: {}, invite: {} },
    presence: { events: [[Object]] },
    device_lists: { changed: [], left: [] },
    rooms: {
      leave: {},
      join: {
        "!GZrqPFfcDEoMHVfNZk:localhost": {
          timeline: {
            events: [
              {
                origin_server_ts: 1550743328530,
                sender: "@scichat:localhost",
                event_id: "$15507433283PbuzG:localhost",
                unsigned: [Object],
                state_key: "",
                content: [Object],
                type: "m.room.join_rules"
              },
              {
                origin_server_ts: 1550743328812,
                sender: "@scichat:localhost",
                event_id: "$15507433284abIdu:localhost",
                unsigned: [Object],
                state_key: "",
                content: [Object],
                type: "m.room.history_visibility"
              },
              {
                origin_server_ts: 1550743329042,
                sender: "@scichat:localhost",
                event_id: "$15507433295HSXNI:localhost",
                unsigned: [Object],
                state_key: "",
                content: [Object],
                type: "m.room.guest_access"
              },
              {
                origin_server_ts: 1550743427888,
                sender: "@scichat:localhost",
                event_id: "$15507434277vLuJc:localhost",
                unsigned: [Object],
                state_key: "",
                content: [Object],
                type: "m.room.name"
              },
              {
                origin_server_ts: 1550743428087,
                sender: "@scichat:localhost",
                event_id: "$15507434288QhvTV:localhost",
                unsigned: [Object],
                state_key: "",
                content: [Object],
                type: "m.room.topic"
              },
              {
                origin_server_ts: 1550743436345,
                sender: "@scichat:localhost",
                event_id: "$15507434369HYiwL:localhost",
                unsigned: [Object],
                state_key: "",
                content: [Object],
                type: "m.room.canonical_alias"
              },
              {
                origin_server_ts: 1550743436382,
                sender: "@scichat:localhost",
                event_id: "$155074343610VUbla:localhost",
                unsigned: [Object],
                state_key: "localhost",
                content: [Object],
                type: "m.room.aliases"
              },
              {
                origin_server_ts: 1550743462381,
                sender: "@scichat:localhost",
                event_id: "$155074346211VMOrY:localhost",
                unsigned: [Object],
                state_key: "",
                content: [Object],
                type: "org.matrix.room.preview_urls"
              },
              {
                origin_server_ts: 1550743574991,
                sender: "@scichat:localhost",
                event_id: "$155074357412dicRP:localhost",
                unsigned: [Object],
                state_key: "",
                content: [Object],
                type: "m.room.avatar"
              },
              {
                origin_server_ts: 1550756313780,
                sender: "@scichat:localhost",
                event_id: "$15507563139JjcZy:localhost",
                unsigned: [Object],
                content: [Object],
                type: "m.room.message"
              }
            ]
          }
        },
        "!vsaQURyAlhfBlxejio:localhost": {
          timeline: {
            events: [
              {
                origin_server_ts: 1550755871266,
                sender: "@scichat:localhost",
                event_id: "$15507558710iDprM:localhost",
                unsigned: [Object],
                state_key: "",
                content: [Object],
                type: "m.room.create"
              },
              {
                origin_server_ts: 1550755871515,
                sender: "@scichat:localhost",
                event_id: "$15507558711AxJCI:localhost",
                unsigned: [Object],
                state_key: "@scichat:localhost",
                content: [Object],
                type: "m.room.member"
              },
              {
                origin_server_ts: 1550755871796,
                sender: "@scichat:localhost",
                event_id: "$15507558712jeaJX:localhost",
                unsigned: [Object],
                state_key: "",
                content: [Object],
                type: "m.room.power_levels"
              },
              {
                origin_server_ts: 1550755872076,
                sender: "@scichat:localhost",
                event_id: "$15507558723mrOMM:localhost",
                unsigned: [Object],
                state_key: "",
                content: [Object],
                type: "m.room.canonical_alias"
              },
              {
                origin_server_ts: 1550755872325,
                sender: "@scichat:localhost",
                event_id: "$15507558724oBAMA:localhost",
                unsigned: [Object],
                state_key: "",
                content: [Object],
                type: "m.room.join_rules"
              },
              {
                origin_server_ts: 1550755872523,
                sender: "@scichat:localhost",
                event_id: "$15507558725hBKve:localhost",
                unsigned: [Object],
                state_key: "",
                content: [Object],
                type: "m.room.history_visibility"
              },
              {
                origin_server_ts: 1550755872739,
                sender: "@scichat:localhost",
                event_id: "$15507558726BUvnk:localhost",
                unsigned: [Object],
                state_key: "",
                content: [Object],
                type: "m.room.name"
              },
              {
                origin_server_ts: 1550755872955,
                sender: "@scichat:localhost",
                event_id: "$15507558727nHEDp:localhost",
                unsigned: [Object],
                state_key: "",
                content: [Object],
                type: "m.room.topic"
              }
            ]
          }
        },
        "!sCLffhQkPDsFYbEUCV:localhost": {
          timeline: {
            events: [
              {
                origin_server_ts: 1551172154346,
                sender: "@scichat:localhost",
                event_id: "$15511721540nBatE:localhost",
                unsigned: [Object],
                state_key: "",
                content: [Object],
                type: "m.room.create"
              },
              {
                origin_server_ts: 1551172154582,
                sender: "@scichat:localhost",
                event_id: "$15511721541Plvlh:localhost",
                unsigned: [Object],
                state_key: "@scichat:localhost",
                content: [Object],
                type: "m.room.member"
              },
              {
                origin_server_ts: 1551172154790,
                sender: "@scichat:localhost",
                event_id: "$15511721542VQIrq:localhost",
                unsigned: [Object],
                state_key: "",
                content: [Object],
                type: "m.room.power_levels"
              },
              {
                origin_server_ts: 1551172155021,
                sender: "@scichat:localhost",
                event_id: "$15511721553BcYCV:localhost",
                unsigned: [Object],
                state_key: "",
                content: [Object],
                type: "m.room.canonical_alias"
              },
              {
                origin_server_ts: 1551172155188,
                sender: "@scichat:localhost",
                event_id: "$15511721554OXJLR:localhost",
                unsigned: [Object],
                state_key: "",
                content: [Object],
                type: "m.room.join_rules"
              },
              {
                origin_server_ts: 1551172155367,
                sender: "@scichat:localhost",
                event_id: "$15511721555rWvyo:localhost",
                unsigned: [Object],
                state_key: "",
                content: [Object],
                type: "m.room.history_visibility"
              },
              {
                origin_server_ts: 1551172155517,
                sender: "@scichat:localhost",
                event_id: "$15511721556hXIAq:localhost",
                unsigned: [Object],
                state_key: "",
                content: [Object],
                type: "m.room.name"
              },
              {
                origin_server_ts: 1551172155765,
                sender: "@scichat:localhost",
                event_id: "$15511721557LlNXv:localhost",
                unsigned: [Object],
                state_key: "",
                content: [Object],
                type: "m.room.topic"
              },
              {
                origin_server_ts: 1551172155913,
                sender: "@scichat:localhost",
                event_id: "$15511721558EREnD:localhost",
                unsigned: [Object],
                state_key: "localhost",
                content: [Object],
                type: "m.room.aliases"
              }
            ]
          }
        }
      },
      invite: {}
    }
  }
}
