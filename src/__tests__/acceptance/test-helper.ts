import {
  Client,
  createRestAppClient,
  givenHttpServerConfig,
} from "@loopback/testlab";
import { ScichatLoopbackApplication } from "../..";

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.HOST,
    // port: +process.env.PORT,
  });

  const app = new ScichatLoopbackApplication({
    rest: restConfig,
  });

  await app.boot();

  app.bind("datasources.config.mongodb").to({
    name: "mongodb",
    connector: "mongodb",
  });

  await app.start();

  const client = createRestAppClient(app);

  return { app, client };
}

export interface AppWithClient {
  app: ScichatLoopbackApplication;
  client: Client;
}
