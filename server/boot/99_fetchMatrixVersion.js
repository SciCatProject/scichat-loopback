'use strict';

const requestPromise = require('request-promise');
const configs = require('../config.local');
const logger = require('../../common/logger');

module.exports = async function(app) {
  const serverHost = configs.synapse.host;
  const serverPort = configs.synapse.port;

  let baseUrl;

  if (serverHost) {
    if (serverPort) {
      baseUrl = `https://${serverHost}:${serverPort}`;
    } else {
      baseUrl = `https://${serverHost}`;
    }
  }

  const request = {
    method: 'GET',
    uri: baseUrl.concat('/_matrix/client/versions'),
    rejectUnauthorized: false,
    json: true,
  };

  try {
    logger.logInfo('Requesting matrix server versions', {baseUrl});
    const version = await requestPromise(request);
    logger.logInfo('Request for server versions successful', {version});
  } catch (err) {
    logger.logError(err.message, {
      location: 'Fetching matrix server versions',
    });
  }
};
