"use strict";

const config = require("../config.local");
const rabbitMqConsumer = require("../../rabbitmq/consumer");

module.exports = function(app) {
  const rabbitMqEnabled = config.rabbitmq ? config.rabbitmq.enabled : false;
  if (rabbitMqEnabled) {
    rabbitMqConsumer(app);
  }
};
