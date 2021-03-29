"use strict";

const config = require("../../server/config.local");
const logger = require("../logger");

const MatrixRestClient = require("./matrix-rest-client");
const matrixClient = new MatrixRestClient();

const user = config.synapse.bot.name;
const pass = config.synapse.bot.password;

module.exports = function(Logbook) {
  const app = require("../../server/server");

  let accessToken;

  Logbook.beforeRemote("*", async function() {
    try {
      logger.logInfo("Looking for access token in db", {});
      const AccessToken = app.models.AccessToken;
      const tokenInstance = await AccessToken.findOne({
        where: { userId: user },
      });
      if (tokenInstance && tokenInstance.userId === user) {
        accessToken = tokenInstance.id;
        logger.logInfo("Found access token", { accessToken });
      } else {
        logger.logInfo(
          "Access token not found, requesting new access token",
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
        logger.logInfo("Request for new access token successful", {
          accessToken,
        });
      }
    } catch (err) {
      logger.logError(err.message, { location: "Logbook.beforeRemote" });
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
        logger.logInfo("Fetching id for room", { name });
        const roomId = await matrixClient.fetchRoomIdByName(name);
        logger.logInfo("Found id", { roomId });
        logger.logInfo("Fetching messages for room", { name });
        return await matrixClient.fetchRoomMessages(roomId, accessToken);
      } catch (err) {
        if (
          err.error.errcode === "M_UNKNOWN_TOKEN" ||
          err.error.errcode === "M_MISSING_TOKEN"
        ) {
          renewAccessToken();
          continue;
        } else {
          logger.logError(err.message, {
            location: "Logbook.findByName",
            name,
          });
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
        logger.logInfo("Fetching messages for all rooms", {});
        return await matrixClient.fetchAllRoomsMessages(accessToken);
      } catch (err) {
        if (
          (err.error && err.error.errcode === "M_UNKNOWN_TOKEN") ||
          err.error.errcode === "M_MISSING_TOKEN"
        ) {
          await renewAccessToken();
          continue;
        } else {
          logger.logError(err.message, {});
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
        logger.logInfo("Fetching id for room", { name });
        const roomId = await matrixClient.fetchRoomIdByName(name);
        logger.logInfo("Found id", { roomId });
        logger.logInfo("Fetching messages for room", { name });
        return await matrixClient.fetchRoomMessages(
          roomId,
          accessToken,
          filter
        );
      } catch (err) {
        if (
          (err.error && err.error.errcode === "M_UNKNOWN_TOKEN") ||
          err.error.errcode === "M_MISSING_TOKEN"
        ) {
          await renewAccessToken();
          continue;
        } else {
          logger.logError(err.message, {
            location: "Logbook.filter",
            name,
            filter,
          });
        }
      }
      break;
    } while (true);
  };

  async function renewAccessToken() {
    try {
      logger.logInfo("Requesting new access token", {});

      const AccessToken = app.models.AccessToken;
      await AccessToken.destroyAll({ userId: user });

      accessToken = await matrixClient.login(user, pass);
      const token = {
        id: accessToken,
        ttl: 1209600,
        created: new Date(),
        userId: user,
      };
      await AccessToken.create(token);

      logger.logInfo("Request for new access token successful", {
        accessToken,
      });
    } catch (err) {
      logger.logError(err.message, { location: "Logbook.renewAccessToken" });
    }
  }
};
