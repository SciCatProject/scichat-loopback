import { inject, lifeCycleObserver, LifeCycleObserver } from "@loopback/core";
import { repository } from "@loopback/repository";
import {
  Queue,
  RabbitMQMessageBroker,
} from "@user-office-software/duo-message-broker";
import _ from "lodash";
import { Member, ProposalMessageData } from "..";
import { SynapseTokenRepository } from "../repositories";
import { SynapseService } from "../services";
import { Utils } from "../utils";

const proposalStatusTrigger =
  process.env.PROPOSAL_STATUS_TRIGGER ?? "ALLOCATED";

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver("")
export class RabbitMqObserver implements LifeCycleObserver {
  constructor(
    @inject("utils") protected utils: Utils,
    @repository(SynapseTokenRepository)
    public synapseTokenRepositry: SynapseTokenRepository,
    @inject("services.Synapse") protected synapseService: SynapseService,
  ) {}

  username = process.env.SYNAPSE_BOT_NAME ?? "";
  password = process.env.SYNAPSE_BOT_PASSWORD ?? "";
  serverName = process.env.SYNAPSE_SERVER_NAME ?? "ess";

  /**
   * This method will be invoked when the application initializes. It will be
   * called at most once for a given application instance.
   */
  async init(): Promise<void> {
    // Add your logic for init
  }

  async checkForSynapseTokenOrCreateOne() {
    try {
      // Add pre-invocation logic here
      console.log("Looking for Synapse token in database");
      const userId = `@${this.username}:${this.serverName}`;
      const tokenInstance = await this.synapseTokenRepositry.findOne({
        where: { user_id: userId },
      });
      if (tokenInstance && tokenInstance.user_id === userId) {
        console.log("Found Synapse token", {
          synapseToken: tokenInstance.access_token,
        });
      } else {
        console.log("Synapse token not found, requesting new token");
        const synapseLoginResponse = await this.synapseService.login(
          this.username,
          this.password,
        );
        await this.synapseTokenRepositry.create(
          _.omit(synapseLoginResponse, "well_known"),
        );
        console.log("Request for new access token successful", {
          synapseToken: synapseLoginResponse.access_token,
        });
      }
    } catch (err) {
      console.error(err);
      // Add error handling logic here
    }
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
              /**
               * TODO: This should be solved a bit better because there is already an interceptor for this.
               * When we use the RabbitMQ messages we call Util functions directly and completely skipping the interceptor
               * Now the interceptor logic is duplicated here and used to check for token every time we receive a new message on the queue.
               */
              await this.checkForSynapseTokenOrCreateOne();
              console.log("Message type ", type);
              console.log("Message content: ", message);

              const proposalMessage = message as ProposalMessageData;
              if (proposalMessage.newStatus !== proposalStatusTrigger) {
                console.log(
                  `Non trigger status ${proposalStatusTrigger}. Nothing to do`,
                );

                return;
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
                      member.firstName.toLowerCase().replace(/\s/g, "") +
                      member.lastName.toLowerCase().replace(/\s/g, ""),
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
