import { Client, expect } from "@loopback/testlab";
import { ScichatLoopbackApplication } from "../../application";
import { setupApplication } from "./test-helper";

describe("UserController", () => {
  let app: ScichatLoopbackApplication;
  let client: Client;

  before("setupApplication", async () => {
    ({ app, client } = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  context("login", () => {
    it("should", async () => {
      const res = await client
        .post("/scichatapi/Users/login")
        .send({ username: "logbookReader", password: "logrdr" });

      expect(res.body).to.have.property("token");
    });
  });
});
