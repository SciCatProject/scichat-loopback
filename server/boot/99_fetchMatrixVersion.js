'use strict';

const requestPromise = require('request-promise');
const configs = require('../config.local');

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
    console.log('[+] Requesting matrix server versions from ' + baseUrl);
    const version = await requestPromise(request);
    console.log('[+] Request for server versions successful');
    console.log(version);
  } catch (err) {
    console.error('[-] Error requesting matrix server versions: ', err);
  }
};
