import { Client } from "@loopback/testlab";
import { ScichatLoopbackApplication } from "../../application";
import { setupApplication } from "./test-helper";

describe("LogbookController (acceptance)", () => {
  let app: ScichatLoopbackApplication;
  let client: Client;

  before("setupApplication", async () => {
    ({ app, client } = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  context("find", () => {
    it("should resolve in a 401 code with unauthenticated user", async () => {
      await client.get("/scichatapi/Logbooks").expect(401);
    });
  });

  context("findByName", () => {
    it("should resolve in a 401 code with unauthenticated user", async () => {
      await client.get("/scichatapi/Logbooks/123456").expect(401);
    });
  });

  // context("sendMessage", () => {
  //   it("should resolve in a 401 code with unauthenticated user", async () => {
  //     const result = await client.post("/scichatapi/Logbooks/123456/message");
  //     expect(result.statusCode).equal(401);
  //   });
  // });
});
