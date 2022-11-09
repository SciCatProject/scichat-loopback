import { inject, lifeCycleObserver, LifeCycleObserver } from "@loopback/core";
import { RabbitMQMessageBroker } from "@user-office-software/duo-message-broker";
import { Member, ProposalAcceptedMessage } from "..";
import { Utils } from "../utils";

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver("")
export class RabbitMqObserver implements LifeCycleObserver {
  constructor(@inject("utils") protected utils: Utils) {}

  /**
   * This method will be invoked when the application initializes. It will be
   * called at most once for a given application instance.
   */
  async init(): Promise<void> {
    // Add your logic for init
  }

  /**
   * This method will be invoked when the application starts.
   */
  async start(): Promise<void> {
    const rabbitMqEnabled = process.env.RABBITMQ_ENABLED ?? "no";
    if (rabbitMqEnabled === "yes") {
      const rabbitMq = new RabbitMQMessageBroker();

      await rabbitMq.setup({
        hostname: process.env.RABBITMQ_HOST ?? "localhost",
        username: process.env.RABBITMQ_USER ?? "rabbitmq",
        password: process.env.RABBITMQ_PASSWORD ?? "rabbitmq",
      });

      await rabbitMq.listenOnBroadcast(async (type, message: unknown) => {
        if (type === "PROPOSAL_ACCEPTED") {
          console.log("PROPOSAL_ACCEPTED", message);
          const proposalAcceptedMessage = message as ProposalAcceptedMessage;
          const members: Member[] = proposalAcceptedMessage.members;
          if (proposalAcceptedMessage.proposer) {
            members.push(proposalAcceptedMessage.proposer);
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
                  member.firstName.toLowerCase().replace(/\s/g, "") +
                  member.lastName.toLowerCase().replace(/\s/g, ""),
              );
              const logbookDetails = await this.utils.createRoom(
                proposalAcceptedMessage.shortCode,
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
        } else {
          throw new Error("Received unknown event");
        }
      });
    }
  }

  /**
   * This method will be invoked when the application stops.
   */
  async stop(): Promise<void> {
    // Add your logic for stop
  }
}
