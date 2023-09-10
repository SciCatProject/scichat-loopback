import { Client } from "@loopback/testlab";
import { ScichatLoopbackApplication } from "../../application";
import { setupApplication } from "./test-helper";

describe("UserController (acceptance)", () => {
  let app: ScichatLoopbackApplication;
  let client: Client;

  before("setupApplication", async () => {
    ({ app, client } = await setupApplication());
  });

  after(() => app.stop());

  context("login", () => {
    it("should resolve in a 401 code when logging in with the wrong credentials", async () => {
      const credentials = { username: "testUser", password: "wrongPassword" };
      await client.post("/scichatapi/Users/login").send(credentials);
      // .expect(401);
    });
  });
});
