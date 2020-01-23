/* eslint-disable padded-blocks */
'use strict';

const amqp = require('amqplib/callback_api');

const config = require('../server/config.local');
const logger = require('../common/logger');

const user = config.synapse.bot.name;
const pass = config.synapse.bot.password;

module.exports = function(app) {

  if (config.rabbitmq.host) {
    let url;
    if (config.rabbitmq.port) {
      url = `amqp://${user}:${pass}@${config.rabbitmq.host}:${config.rabbitmq.port}`;
    } else {
      url = `amqp://${user}:${pass}@${config.rabbitmq.host}`;
    }

    logger.logInfo('Connecting to RabbitMq', {url});

    amqp.connect(url, function(error0, connection) {
      if (error0) {
        logger.logError(error0.message, {location: 'amqp.connect', url});
      } else {
        connection.createChannel(function(error1, channel) {
          if (error1) {
            logger.logError(error1.message, {
              location: 'connection.createChannel',
              connection,
            });
          } else {
            const queue = config.rabbitmq.queue;

            channel.assertQueue(queue, {
              durable: true,
            });

            channel.prefetch(1);

            logger.logInfo('RABBITMQ Waiting for messages', {queue});

            channel.consume(
              queue,
              async function(msg) {
                const msgJSON = JSON.parse(msg.content);
                switch (msgJSON.eventType) {
                  case 'PROPOSAL_ACCEPTED': {
                    logger.logInfo('RabbitMq received message', {
                      message: msg.content.toString(),
                    });
                    try {
                      const Room = app.models.Room;
                      const room = Room.create(
                        msgJSON.proposalID,
                        msgJSON.users
                      );
                      logger.logInfo('Created room', {room});
                    } catch (err) {
                      logger.logError(err.message, {
                        location: 'channel.consume',
                      });
                    }
                    channel.ack(msg);
                    break;
                  }
                  default:
                    channel.ack(msg);
                    break;
                }
              },
              {
                noAck: false,
              }
            );
          }
        });
      }
    });
  }
};
