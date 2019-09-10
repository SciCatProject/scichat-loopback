'use strict';

const config = require('../../server/config.local');

const MatrixRestClient = require('./matrix-rest-client');
const matrixClient = new MatrixRestClient();

const user = config.synapse.bot.name;
const pass = config.synapse.bot.password;

module.exports = function(Logbook) {
  const app = require('../../server/server');
  let accessToken;

  Logbook.beforeRemote('*', async function() {
    try {
      const AccessToken = app.models.AccessToken;
      const tokenInstance = await AccessToken.findOne({where: {userId: user}});
      if (tokenInstance && tokenInstance.userId === user) {
        accessToken = tokenInstance.id;
      } else {
        accessToken = await matrixClient.login(user, pass);
        const token = {
          id: accessToken,
          ttl: 1209600,
          created: new Date(),
          userId: user,
        };
        await AccessToken.create(token);
      }
    } catch (err) {
      console.error(err);
    }
  });
  /**
   * Find Logbook model instance by name
   * @param {string} name Name of the Logbook
   * @returns {Logbook} Logbook model instance
   */

  Logbook.findByName = async function(name) {
    try {
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
      const rooms = await matrixClient.fetchRooms(accessToken);
      return await matrixClient.fetchAllRoomsMessages(rooms, accessToken);
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Filter Logbook entries matching query
   * @param {string} name The name of the Logbook
   * @param {string} filter Filter rison object, keys: textSearch, showBotMessages, showUserMessages, showImages
   * @returns {Logbook} Filtered Logbook model instance
   */

  Logbook.filter = async function(name, filter) {
    try {
      const room = await matrixClient.fetchRoomByName(name, accessToken);
      return await matrixClient.fetchRoomMessages(room, accessToken, filter);
    } catch (err) {
      console.error(err);
    }
  };
};
