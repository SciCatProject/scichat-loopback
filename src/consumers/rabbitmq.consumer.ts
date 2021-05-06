import { inject } from "@loopback/context";
import { rabbitConsume } from "loopback-rabbitmq";
import { Utils } from "../utils";

interface Message {
  queue: string;
  type: string;
  msg: string;
}

export class RabbitMQConsumer {
  rabbitMqEnabled: string = process.env.RABBITMQ_ENABLED ?? "no";

  constructor(@inject("utils") protected utils: Utils) {
    if (this.rabbitMqEnabled === "yes") {
      console.log("Starting RabbitMQ Consumer");
    }
  }

  @rabbitConsume({
    exchange: process.env.RABBITMQ_EXCHANGE ?? "amq.direct",
    routingKey: process.env.RABBITMQ_ROUTING_KEY ?? "tenant.webhook",
    queue: process.env.RABBITMQ_QUEUE ?? "webhooks",
  })
  async handle(message: Message) {
    if (message.type === "PROPOSAL_ACCEPTED") {
      console.log("RabbitMQ received message: ", message);
      const parsedMsg = JSON.parse(message.msg);
      const name = parsedMsg.proposalId;
      const invites = parsedMsg.invites;
      do {
        try {
          const logbookDetails = this.utils.createRoom(name, invites);
          console.log("Room created with details: ", logbookDetails);
        } catch (err) {
          if (
            err.error &&
            (err.error.errcode === "M_UNKNOWN_TOKEN" ||
              err.error.errcode === "M_MISSING_TOKEN")
          ) {
            await this.utils.renewAccessToken();
            continue;
          } else {
            console.error(err);
          }
        }
        break;
      } while (true);
    } else {
      console.log("Message: ", message);
    }
  }
}
