'use strict';

const config = require('../../server/config.local');

const MatrixRestClient = require('./matrix-rest-client');
const matrixClient = new MatrixRestClient();

const user = config.synapse.bot.name;
const pass = config.synapse.bot.password;
const server = config.synapse.host;

module.exports = function(Room) {
  /* Creates a new Synapse chat room
   * @param {string} name The proposalId from which to generate the room name
   * @param {string[]} invites An array of strings, where the strings are the ldap usernames (firstnamelastname) of the people you wish to invite
   * @returns {object} Object containing properties room_alias and room_id
   */

  Room.create = async function(name, invites) {
    let formattedInvites;
    if (invites) {
      formattedInvites = invites.map(invite => {
        return `@${invite}:${server}`;
      });
    }
    try {
      const accessToken = await matrixClient.login(user, pass);
      return await matrixClient.createRoom(accessToken, name, formattedInvites);
    } catch (err) {
      console.error(err);
    }
  };
};
