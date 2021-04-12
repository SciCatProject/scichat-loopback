import { genSalt, hash } from "bcryptjs";
import { ApplicationConfig, ScichatLoopbackApplication } from "./application";
import { UserRepository } from "./repositories";

export * from "./application";
export * from "./jwt-authentication-component";
export * from "./keys";

export async function main(options: ApplicationConfig = {}) {
  const app = new ScichatLoopbackApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

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
