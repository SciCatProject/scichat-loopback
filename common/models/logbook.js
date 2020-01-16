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
      console.log('[+] Looking for access token in db');
      const AccessToken = app.models.AccessToken;
      const tokenInstance = await AccessToken.findOne({
        where: { userId: user }
      });
      if (tokenInstance && tokenInstance.userId === user) {
        console.log('[+] Found access token');
        accessToken = tokenInstance.id;
      } else {
        console.log('[+] Access token not found, requesting new access token');
        accessToken = await matrixClient.login(user, pass);
        const token = {
          id: accessToken,
          ttl: 1209600,
          created: new Date(),
          userId: user
        };
        await AccessToken.create(token);
        console.log('[+] Request for new access token successful');
      }
    } catch (err) {
      console.error('[-] Error requesting new access token', err);
    }
  });

  /**
   * Find Logbook model instance by name
   * @param {string} name Name of the Logbook
   * @returns {Logbook} Logbook model instance
   */

  Logbook.findByName = async function(name) {
    do {
      try {
        console.log('[+] Fetching id for room: ' + name);
        const roomId = await matrixClient.fetchRoomIdByName(name);
        console.log('[+] Found id: ' + roomId);
        console.log('[+] Fetching messages for room: ' + name);
        return await matrixClient.fetchRoomMessages(roomId, accessToken);
      } catch (err) {
        if (
          err.error.errcode === 'M_UNKNOWN_TOKEN' ||
          err.error.errcode === 'M_MISSING_TOKEN'
        ) {
          renewAccessToken();
          continue;
        } else {
          console.error('[-] Error in Logbook.findByName', err);
        }
      }
      break;
    } while (true);
  };

  /**
   * Find all Logbook model instances
   * @returns {Logbook[]} Array of Logbook model instances
   */

  Logbook.findAll = async function() {
    do {
      try {
        console.log('[+] Fetching messages for all rooms');
        return await matrixClient.fetchAllRoomsMessages(accessToken);
      } catch (err) {
        if (
          (err.error && err.error.errcode === 'M_UNKNOWN_TOKEN') ||
          err.error.errcode === 'M_MISSING_TOKEN'
        ) {
          await renewAccessToken();
          continue;
        } else {
          console.error('[-] Error in Logbook.findAll', err);
        }
      }
      break;
    } while (true);
  };

  /**
   * Filter Logbook entries matching query
   * @param {string} name The name of the Logbook
   * @param {string} filter Filter rison object, keys: textSearch, showBotMessages, showUserMessages, showImages
   * @returns {Logbook} Filtered Logbook model instance
   */

  Logbook.filter = async function(name, filter) {
    do {
      try {
        console.log('[+] Fetching id for room: ' + name);
        const roomId = await matrixClient.fetchRoomIdByName(name);
        console.log('[+] Found id: ' + roomId);
        console.log('[+] Fetching messages for room: ' + name);
        return await matrixClient.fetchRoomMessages(
          roomId,
          accessToken,
          filter
        );
      } catch (err) {
        if (
          (err.error && err.error.errcode === 'M_UNKNOWN_TOKEN') ||
          err.error.errcode === 'M_MISSING_TOKEN'
        ) {
          await renewAccessToken();
          continue;
        } else {
          console.error('[-] Error in Logbook.filter', err);
        }
      }
      break;
    } while (true);
  };

  async function renewAccessToken() {
    try {
      console.log('[+] Requesting new access token');

      const AccessToken = app.models.AccessToken;
      await AccessToken.destroyAll({ userId: user });

      accessToken = await matrixClient.login(user, pass);
      const token = {
        id: accessToken,
        ttl: 1209600,
        created: new Date(),
        userId: user
      };
      await AccessToken.create(token);

      console.log('[+] Request for new access token successful');
    } catch (err) {
      console.error('[-] Error requesting new access token', err);
    }
  }
};
