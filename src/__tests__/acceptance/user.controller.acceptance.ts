import { Client, expect } from "@loopback/testlab";
import { ScichatLoopbackApplication } from "../../application";
import {
  givenCredentials,
  givenEmptyDatabase,
  givenUserAccount,
} from "../helpers";
import { setupApplication } from "./test-helper";

describe("UserController", () => {
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
    it("should", async () => {
      const credentials = givenCredentials();
      const res = await client
        .post("/scichatapi/Users/login")
        .send(credentials);

      expect(res.body).to.have.property("token");
    });
  });
});
