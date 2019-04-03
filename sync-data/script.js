'use strict';

const SyncData = require('./sync-data');
const sync = new SyncData();

sync
  .syncRooms()
  .then(roomResponse => {
    console.log(roomResponse);
    return sync.syncRoomEvents();
  })
  .then(roomEventResponse => {
    console.log(roomEventResponse);
    return sync.syncRoomMessages();
  })
  .then(roomMessageResponse => {
    console.log(roomMessageResponse);
    return sync.syncRoomMembers();
  })
  .then(roomMemberResponse => {
    console.log(roomMemberResponse);
    return sync.syncRoomImages();
  })
  .then(roomImageResponse => {
    console.log(roomImageResponse);
  });
