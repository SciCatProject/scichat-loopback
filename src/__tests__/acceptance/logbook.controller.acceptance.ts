import { Client } from "@loopback/testlab";
import { ScichatLoopbackApplication } from "../../application";
import { setupApplication } from "./test-helper";

describe("LogbookController", () => {
  let app: ScichatLoopbackApplication;
  let client: Client;

  before("setupApplication", async () => {
    ({ app, client } = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  describe("#find()", () => {
    it("should...", async () => {
      await client.get("/scichatapi/Logbooks").expect(200);
    });
  });
});
