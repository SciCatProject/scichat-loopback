"use strict";

const configs = require("../config.local");
const logger = require("../../common/logger");
const superagent = require("superagent");

module.exports = async function(app) {
  const serverHost = configs.synapse.host;
  const serverPort = configs.synapse.port;

  let baseUrl;

  if (serverHost) {
    if (serverPort) {
      baseUrl = `${serverHost}:${serverPort}`;
    } else {
      baseUrl = serverHost;
    }
  }

  const url = baseUrl + "/_matrix/client/versions";

  try {
    logger.logInfo("Requesting matrix server versions", { baseUrl });
    const response = await superagent.get(url);
    const version = response.body;
    logger.logInfo("Request for server versions successful", { version });
  } catch (err) {
    logger.logError(err.message, {
      location: "Fetching matrix server versions",
    });
  }
};
