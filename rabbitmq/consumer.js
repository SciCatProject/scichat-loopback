'use strict';

const amqp = require('amqplib/callback_api');
const config = require('../server/config.local');
const MatrixRestClient = require('../common/models/matrix-rest-client');
const matrixClient = new MatrixRestClient();

module.exports = function() {
  if (config.rabbitmq.host) {
    let url;
    if (config.rabbitmq.port) {
      url = `amqp://${config.rabbitmq.host}:${config.rabbitmq.port}`;
    } else {
      url = `amqp://${config.rabbitmq.host}`;
    }

    amqp.connect(url, function(error0, connection) {
      if (error0) {
        throw error0;
      }

      connection.createChannel(function(error1, channel) {
        if (error1) {
          throw error1;
        }

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
                  const room = await matrixClient.fetchRoomByName(
                    msgJSON.proposalID
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
      });
    });
  }
};
