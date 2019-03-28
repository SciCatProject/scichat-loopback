const SyncData = require('./SyncData');
const sync = new SyncData();

sync.syncRooms().then(response => {
  console.log(response);
});

sync.syncRoomEvents().then(response => {
  console.log(response);
});

sync.syncRoomMessages().then(response => {
  console.log(response);
});

sync.syncRoomMembers().then(response => {
  console.log(response);
});
