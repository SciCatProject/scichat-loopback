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

  createIdList(type, dbMap) {
    let ids = [];
    dbMap.forEach(mapElement => {
      switch (type) {
        case 'event': {
          mapElement.events.forEach(event => {
            ids.push(event.eventId);
          });
          break;
        }
        case 'message': {
          mapElement.messages.forEach(message => {
            ids.push(message.eventId);
          });
          break;
        }
        case 'member': {
          mapElement.members.forEach(member => {
            ids.push(member.eventId);
          });
          break;
        }
        default: {
          console.log(`Type '${type}' is not a valid option.`);
        }
      }
    });
    return ids;
  }
};
