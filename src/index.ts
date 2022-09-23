import {
  Queue,
  RabbitMQMessageBroker,
} from "@user-office-software/duo-message-broker";
import { genSalt, hash } from "bcryptjs";
import { ApplicationConfig, ScichatLoopbackApplication } from "./application";
import { UserRepository } from "./repositories";
import { Utils } from "./utils";

export * from "./application";
export * from "./jwt-authentication-component";
export * from "./keys";

export interface Member {
  firstName: string;
  lastName: string;
  email: string;
}

export interface ProposalMessageData {
  proposalPk: number;
  shortCode: string;
  title: string;
  abstract: string;
  newStatus?: string;
  members: { firstName: string; lastName: string; email: string; id: string }[];
  proposer?: { firstName: string; lastName: string; email: string; id: string };
}

export async function main(options: ApplicationConfig = {}) {
  const app = new ScichatLoopbackApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);

  const username = process.env.SCICHAT_USER;
  const password = process.env.SCICHAT_PASSWORD;

  const rabbitmqMessageType: string =
    process.env.RABBITMQ_MESSAGE_TYPE ?? "PROPOSAL_STATUS_CHANGED_BY_WORKFLOW";
  const proposalStatusTrigger: string =
    process.env.PROPOSAL_STATUS_TRIGGER ?? "ALLOCATED";

  if (!username) {
    throw new Error("SCICHAT_USER environment variable not defined");
  }

  const userRepository = await app.getRepository(UserRepository);
  const foundUser = await userRepository.findOne({ where: { username } });

  if (!foundUser) {
    console.log("Creating new user account");
    if (!password) {
      throw new Error("SCICHAT_PASSWORD environment variable not defined");
    }
    const hashedPassword = await hash(password, await genSalt());
    const savedUser = await userRepository.create({ username });
    await userRepository
      .userCredentials(savedUser.id)
      .create({ password: hashedPassword });
  }

  // Set up RabbitMQ
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
        console.log("Received message type : " + type);
        if (type === rabbitmqMessageType) {
          console.log("Message type ", rabbitmqMessageType);
          console.log("Message content: ", message);
          const proposalAcceptedMessage: ProposalMessageData = message as ProposalMessageData;

          if (proposalAcceptedMessage.newStatus === proposalStatusTrigger) {
            console.log("Proposal new status ", proposalStatusTrigger);

            const members: Member[] = proposalAcceptedMessage.members;
            if (proposalAcceptedMessage.proposer) {
              members.push(proposalAcceptedMessage.proposer);
            }

            do {
              try {
                const membersToCreate = await Utils.prototype.membersToCreate(
                  members,
                );
                await Promise.all(
                  membersToCreate.map(async (member) =>
                    Utils.prototype.createUser(member),
                  ),
                );
                const invites = members.map(
                  (member) =>
                    member.firstName.toLowerCase() +
                    member.lastName.toLowerCase(),
                );
                // NOTE: We use shortCode because in UserOffice the shortCode is the proposalId
                const logbookDetails = await Utils.prototype.createRoom(
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
                  await Utils.prototype.renewAccessToken();
                  continue;
                } else {
                  console.error(err);
                }
              }
              break;
            } while (true);
          } else {
            console.log("Non trigger status. Nothing to do");
          }
        } else {
          console.log("Ignoring message");
        }
      },
    );
  }

  return app;
}

if (require.main === module) {
  // Run the application
  const config = {
    rest: {
      port: +(process.env.PORT ?? 3000),
      host: process.env.HOST,
      // The `gracePeriodForClose` provides a graceful close for http/https
      // servers with keep-alive clients. The default value is `Infinity`
      // (don't force-close). If you want to immediately destroy all sockets
      // upon stop, set its value to `0`.
      // See https://www.npmjs.com/package/stoppable
      gracePeriodForClose: 5000, // 5 seconds
      openApiSpec: {
        // useful when used with OpenAPI-to-GraphQL to locate your application
        setServersFromRequest: true,
      },
    },
  };
  main(config).catch((err) => {
    console.error("Cannot start the application.", err);
    process.exit(1);
  });
}
