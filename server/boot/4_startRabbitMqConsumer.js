'use strict';

const rabbitMqConsumer = require('../../rabbitmq/consumer');

module.exports = function(app) {
  rabbitMqConsumer();
};
