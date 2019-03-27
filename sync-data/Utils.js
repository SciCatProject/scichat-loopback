module.exports = class Utils {
  constructor() {}
  replaceNonallowedObjectKeyCharacters(events) {
    let keys;
    events.forEach(event => {
      if (event.type === 'm.room.power_levels') {
        keys = Object.keys(event.content.users);
        for (let i = 0; i < keys.length; i++) {
          event.content.users[keys[i].replace(/[^\w\@]/g, '_')] =
            event.content.users[keys[i]];
          delete event.content.users[keys[i]];
        }
        keys = Object.keys(event.content.events);
        for (let i = 0; i < keys.length; i++) {
          event.content.events[keys[i].replace(/\W/g, '_')] =
            event.content.events[keys[i]];
          delete event.content.events[keys[i]];
        }
      } else if (event.type === 'm.room.create') {
        keys = Object.keys(event.content);
        for (let i = 0; i < keys.length; i++) {
          if (keys[i].indexOf('m.') == 0) {
            event.content[keys[i].replace(/\W/g, '_')] = event.content[keys[i]];
            delete event.content[keys[i]];
          }
        }
      }
    });
  }

  createDbRoomIdList(rooms) {
    let dbRoomIds = [];
    rooms.forEach(room => {
      dbRoomIds.push(room.roomId);
    });
    return dbRoomIds;
  }

  createDbEventIdList(dbRoomEvents) {
    let dbEventIds = [];
    dbRoomEvents.forEach(dbRoomEvent => {
      dbRoomEvent.events.forEach(dbEvent => {
        dbEventIds.push(dbEvent.eventId);
      });
    });
    return dbEventIds;
  }

  createDbMessageIdList(dbRoomMessages) {
    let dbMessageIds = [];
    dbRoomMessages.forEach(dbRoomMessage => {
      dbRoomMessage.messages.forEach(dbMessage => {
        dbMessageIds.push(dbMessage.eventId);
      });
    });
    return dbMessageIds;
  }
};
