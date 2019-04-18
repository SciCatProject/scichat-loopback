'use strict';

const SyncData = require('./sync-data');
const sync = new SyncData();

const INTERVAL = 300000; // ms

module.exports = function syncScript() {
  setInterval(() => {
    console.log('Syncing...');
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
        console.log('Sync complete');
      });
  }, INTERVAL);
};
