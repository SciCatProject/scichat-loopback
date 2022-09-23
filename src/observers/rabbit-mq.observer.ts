import { inject, lifeCycleObserver, LifeCycleObserver } from "@loopback/core";
import {
  Queue,
  RabbitMQMessageBroker,
} from "@user-office-software/duo-message-broker";
import { Member, ProposalMessageData } from "..";
import { Utils } from "../utils";

const proposalStatusTrigger =
  process.env.PROPOSAL_STATUS_TRIGGER ?? "ALLOCATED";

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

      rabbitMq.listenOn(
        Queue.SCICHAT_PROPOSAL,
        async (type, message: unknown) => {
          switch (type) {
            case "PROPOSAL_STATUS_CHANGED_BY_WORKFLOW":
            case "PROPOSAL_STATUS_CHANGED_BY_USER": {
              console.log("Message type ", type);
              console.log("Message content: ", message);

              const proposalMessage = message as ProposalMessageData;
              if (proposalMessage.newStatus !== proposalStatusTrigger) {
                console.log(
                  `Non trigger status ${proposalStatusTrigger}. Nothing to do`,
                );
              }

              const members: Member[] = proposalMessage.members;
              if (proposalMessage.proposer) {
                members.push(proposalMessage.proposer);
              }

              do {
                try {
                  const membersToCreate = await this.utils.membersToCreate(
                    members,
                  );
                  await Promise.all(
                    membersToCreate.map(async (member) =>
                      this.utils.createUser(member),
                    ),
                  );
                  const invites = members.map(
                    (member) =>
                      member.firstName.toLowerCase() +
                      member.lastName.toLowerCase(),
                  );
                  const logbookDetails = await this.utils.createRoom(
                    proposalMessage.shortCode,
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

              break;
            }
            default:
              console.log("Ignoring message");

              break;
          }
        },
      );
    }
  }

  /**
   * This method will be invoked when the application stops.
   */
  async stop(): Promise<void> {
    // Add your logic for stop
  }
}
