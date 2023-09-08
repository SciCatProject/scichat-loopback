import { Client, expect } from "@loopback/testlab";
import { ScichatLoopbackApplication } from "../../application";
import { setupApplication } from "./test-helper";
describe("LogbookController (acceptance)", () => {
  let app: ScichatLoopbackApplication;
  let client: Client;
  const testDone = (ms = 0) =>
    new Promise((resolve) => setTimeout(resolve, 2000));
  before("setupApplication", async () => {
    ({ app, client } = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  context("find", () => {
    it("should resolve in a 401 code with unauthenticated user", async function () {
      const result = await client.get("/scichatapi/Logbooks");
      expect(result.statusCode).equal(401);
      await testDone();
    }).timeout(10000);
  });

  context("findByName", () => {
    it("should resolve in a 401 code with unauthenticated user", async () => {
      const result = await client.get("/scichatapi/Logbooks/123456");
      expect(result.statusCode).equal(401);
    });
  });

  // context("sendMessage", () => {
  //   it("should resolve in a 401 code with unauthenticated user", async () => {
  //     const result = await client.post("/scichatapi/Logbooks/123456/message");
  //     expect(result.statusCode).equal(401);
  //   });
  // });
});
