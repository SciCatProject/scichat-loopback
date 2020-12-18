'use strict';

const config = require('../../server/config.local');
const logger = require('../logger');

const MatrixRestClient = require('./matrix-rest-client');
const matrixClient = new MatrixRestClient();

const user = config.synapse.bot.name;
const pass = config.synapse.bot.password;

module.exports = function(Room) {
  const app = require('../../server/server');

  let accessToken;

  Room.beforeRemote('*', async function() {
    try {
      logger.logInfo('Looking for access token in db', {});
      const AccessToken = app.models.AccessToken;
      const tokenInstance = await AccessToken.findOne({
        where: {userId: user},
      });
      if (tokenInstance && tokenInstance.userId === user) {
        accessToken = tokenInstance.id;
        logger.logInfo('Found access token', {accessToken});
      } else {
        logger.logInfo(
          'Access token not found, requesting new access token',
          {}
        );
        accessToken = await matrixClient.login(user, pass);
        const token = {
          id: accessToken,
          ttl: 1209600,
          created: new Date(),
          userId: user,
        };
        await AccessToken.create(token);
        logger.logInfo('Request for new access token successful', {
          accessToken,
        });
      }
    } catch (err) {
      logger.logError(err.message, {location: 'Room.beforeRemote'});
    }
  });

  /**
   * Creates a new Synapse chat room
   * @param {string} name The proposalId from which to generate the room name
   * @param {string[]} invites An array of strings, where the strings are the ldap usernames (firstnamelastname) of the people you wish to invite
   * @returns {object} Object containing properties room_alias and room_id
   */

  Room.create = async function(name, invites) {
    do {
      try {
        logger.logInfo('Creating new room', {name, invites});
        return await matrixClient.createRoom(accessToken, name, invites);
      } catch (err) {
        if (err.error && err.error.errcode === 'M_UNKNOWN_TOKEN') {
          await renewAccessToken();
          continue;
        } else {
          logger.logError(err.message, {
            location: 'Room.create',
            name,
            invites,
          });
        }
      }
      break;
    } while (true);
  };

  /**
   * Send a message to room
   * @param {string} name The name of the room
   * @param {object} data JSON object with the key `message`
   * @returns {object} Object containing the event id of the message
   */

  Room.sendMessage = async function(name, data) {
    do {
      try {
        logger.logInfo('Fetching id for room', {name});
        const roomId = await matrixClient.fetchRoomIdByName(name);
        logger.logInfo('Found id', {roomId});
        logger.logInfo('Sending message to room', {name, data});
        return await matrixClient.sendMessage(accessToken, roomId, data);
      } catch (err) {
        if (err.error && err.error.errcode === 'M_UNKNOWN_TOKEN') {
          await renewAccessToken();
          continue;
        } else {
          logger.logError(err.message, {
            location: 'Room.postMessage',
            name,
            data,
          });
        }
      }
      break;
    } while (true);
  };

  async function renewAccessToken() {
    try {
      logger.logInfo('Requesting new access token', {});

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

      logger.logInfo('Request for new access token successful', {
        accessToken,
      });
    } catch (err) {
      logger.logError(err.message, {location: 'Room.renewAccessToken'});
    }
  }
};
