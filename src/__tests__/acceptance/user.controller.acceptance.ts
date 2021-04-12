import { Client, expect } from "@loopback/testlab";
import { ScichatLoopbackApplication } from "../../application";
import {
  givenCredentials,
  givenEmptyDatabase,
  givenUserAccount,
} from "../helpers";
import { setupApplication } from "./test-helper";

describe("UserController (acceptance)", () => {
  let app: ScichatLoopbackApplication;
  let client: Client;

  before("setupApplication", async () => {
    ({ app, client } = await setupApplication());
  });

  before(givenEmptyDatabase);
  before(givenUserAccount);

  after(async () => {
    await app.stop();
  });

  context("login", () => {
    it("should resolve in a 401 code when logging in with the wrong credentials", async () => {
      const credentials = { username: "testUser", password: "wrongPassword" };
      await client
        .post("/scichatapi/Users/login")
        .send(credentials)
        .expect(401);
    });

    it("should resolve in a jwt token when logging in with the correct credentials", async () => {
      const credentials = givenCredentials();
      const res = await client
        .post("/scichatapi/Users/login")
        .send(credentials)
        .expect(200);

      expect(res.body).to.have.property("token");
    });
  });
});
