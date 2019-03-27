const SyncData = require('./SyncData');
const sync = new SyncData();

// sync.syncRooms().then(response => {
//   console.log(response);
// });

sync.syncRoomEvents().then(response => {
  console.log(response);
});
