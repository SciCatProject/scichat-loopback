import { inject } from "@loopback/context";
import { ConsumeMessage, rabbitConsume } from "loopback-rabbitmq";
import { Member, ProposalAcceptedMessage } from ".";
import { Utils } from "../utils";

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
  async handle(message: ProposalAcceptedMessage, rawMessage: ConsumeMessage) {
    if (rawMessage.properties.type === "PROPOSAL_ACCEPTED") {
      console.log("PROPOSAL_ACCEPTED: ", message);

      const members: Member[] = message.members;
      if (message.proposer) {
        members.push(message.proposer);
      }

      do {
        try {
          const membersToCreate = await this.utils.membersToCreate(members);
          await Promise.all(
            membersToCreate.map(async (member) =>
              this.utils.createUser(member),
            ),
          );
          const invites = members.map(
            (member) =>
              member.firstName.toLowerCase() + member.lastName.toLowerCase(),
          );
          const logbookDetails = await this.utils.createRoom(
            message.shortCode,
            invites,
          );
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
    }
  }
}
