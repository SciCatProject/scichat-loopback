'use strict';

const config = require('../../server/config.local');

const MatrixRestClient = require('./matrix-rest-client');
const matrixClient = new MatrixRestClient();

const user = config.synapse.bot.name;
const pass = config.synapse.bot.password;

module.exports = function(Room) {
  const app = require('../../server/server');
  let accessToken;

  Room.beforeRemote('*', async function() {
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

  /* Creates a new Synapse chat room
   * @param {string} name The proposalId from which to generate the room name
   * @param {string[]} invites An array of strings, where the strings are the ldap usernames (firstnamelastname) of the people you wish to invite
   * @returns {object} Object containing properties room_alias and room_id
   */

  Room.create = async function(name, invites) {
    do {
      try {
        return await matrixClient.createRoom(accessToken, name, invites);
      } catch (err) {
        if (err.error && err.error.errcode === 'M_UNKNOWN_TOKEN') {
          await renewAccessToken();
          continue;
        } else {
          console.error('[-] Error in Room.create', err);
        }
      }
      break;
    } while (true);
  };

  async function renewAccessToken() {
    try {
      console.log('[+] Requesting new access token');

      const AccessToken = app.models.AccessToken;
      await AccessToken.destroyAll({userId: user});

      accessToken = await matrixClient.login(user, pass);
      const token = {
        id: accessToken,
        ttl: 1209600,
        created: new Date(),
        userId: user,
      };
      await AccessToken.create(token);

      console.log('[+] Request for new access token successful');
    } catch (err) {
      console.error('[-] Error requesting new access token', err);
    }
  }
};
