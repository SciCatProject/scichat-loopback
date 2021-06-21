import { Queue, RabbitMQMessageBroker } from "@esss-swap/duo-message-broker";
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

export interface ProposalAcceptedMessage {
  proposalId: number;
  shortCode: string;
  title: string;
  members: Member[];
  proposer?: Member;
}

export async function main(options: ApplicationConfig = {}) {
  const app = new ScichatLoopbackApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);

  const username = process.env.SCICHAT_USER;
  const password = process.env.SCICHAT_PASSWORD;

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

    rabbitMq.listenOn(Queue.PROPOSAL, async (type, message: unknown) => {
      if (type === "PROPOSAL_ACCEPTED") {
        console.log("PROPOSAL_ACCEPTED: ", message);
        const proposalAcceptedMessage: ProposalAcceptedMessage = message as ProposalAcceptedMessage;
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
                member.firstName.toLowerCase() + member.lastName.toLowerCase(),
            );
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
        throw new Error("Received unknown event");
      }
    });
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
