'use strict';

const config = require('../../server/config.local');

const MatrixRestClient = require('./matrix-rest-client');
const matrixClient = new MatrixRestClient();

const user = config.synapse.bot.name;
const pass = config.synapse.bot.password;

module.exports = function(Logbook) {
  /**
   * Find Logbook model instance by name
   * @param {string} name Name of the Logbook
   * @returns {Logbook} Logbook model instance
   */

  Logbook.findByName = async function(name) {
    try {
      const accessToken = await matrixClient.login(user, pass);
      const room = await matrixClient.fetchRoomByName(name, accessToken);
      return await matrixClient.fetchRoomMessages(room, accessToken);
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Find all Logbook model instances
   * @returns {Logbook[]} Array of Logbook model instances
   */

  Logbook.findAll = async function() {
    try {
      const accessToken = await matrixClient.login(user, pass);
      const rooms = await matrixClient.fetchRooms(accessToken);
      return await matrixClient.fetchAllRoomsMessages(rooms, accessToken);
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Find Logbooks filtered by names
   * @param {string[]} names Name of the Logbooks
   * @returns {Logbook[]} Array of Logbook model instances
   */

  Logbook.findLogbooksByName = async function(names) {
    const roomNames = rison.decode_array(names);
    try {
      const accessToken = await matrixClient.login(user, pass);
      const allRooms = await matrixClient.fetchRooms(accessToken);
      const filteredRooms = allRooms.filter(room => {
        return roomNames.includes(room.name);
      });
      return await matrixClient.fetchAllRoomsMessages(
        filteredRooms,
        accessToken
      );
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Filter Logbook entries matching query
   * @param {string} name The name of the Logbook
   * @param {string} filter Filter JSON object, keys: textSearch, showBotMessages, showUserMessages, showImages
   * @returns {Logbook} Filtered Logbook model instance
   */

  Logbook.filter = async function(name, filter) {
    try {
      const accessToken = await matrixClient.login(user, pass);
      const room = await matrixClient.fetchRoomByName(name, accessToken);
      return await matrixClient.fetchRoomMessages(room, accessToken, filter);
    } catch (err) {
      console.error(err);
    }
  };
};
