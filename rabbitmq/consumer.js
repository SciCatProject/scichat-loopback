'use strict';

const amqp = require('amqplib/callback_api');
const config = require('../server/config.local');
const MatrixRestClient = require('../common/models/matrix-rest-client');
const matrixClient = new MatrixRestClient();

const user = config.synapse.bot.name;
const pass = config.synapse.bot.password;

module.exports = function() {
  if (config.rabbitmq.host) {
    let url;
    if (config.rabbitmq.port) {
      url = `amqp://${user}:${pass}@${config.rabbitmq.host}:${config.rabbitmq.port}`;
    } else {
      url = `amqp://${user}:${pass}@${config.rabbitmq.host}`;
    }

    amqp.connect(url, function(error0, connection) {
      if (error0) {
        console.error(
          ' [-] Error while connecting to RabbitMq server: ',
          error0
        );
      } else {
        connection.createChannel(function(error1, channel) {
          if (error1) {
            console.error(
              ' [-] Error while creating RabbitMq channel: ',
              error1
            );
          } else {
            const queue = config.rabbitmq.queue;

            channel.assertQueue(queue, {
              durable: true,
            });

            channel.prefetch(1);

            console.log(' [*] RABBITMQ Waiting for messages in %s', queue);

            channel.consume(
              queue,
              async function(msg) {
                let msgJSON = JSON.parse(msg.content);
                switch (msgJSON.eventType) {
                  case 'PROPOSAL_ACCEPTED': {
                    console.log(' [/] Received %s', msg.content.toString());
                    try {
                      const accessToken = await matrixClient.login(user, pass);
                      const room = await matrixClient.createRoom(
                        accessToken,
                        msgJSON.proposalID,
                        msgJSON.users
                      );
                      console.log(' [X] Created room %s', room.room_id);
                    } catch (err) {
                      console.error(' [-] Error while creating room: %s', err);
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
