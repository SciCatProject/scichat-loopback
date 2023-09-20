import { Context } from "@loopback/context";
import { expect } from "@loopback/testlab";
import sinon from "sinon";
import { LogbookController } from "../../controllers";
import { SynapseService } from "../../services";
import { TokenServiceManager } from "../../services/token.service";
import { Utils } from "../../utils";
import {
  givenAllRoomsSyncResponse,
  givenFetchRoomIdByNameResponse,
  givenFetchRoomMessagesResponse,
  givenGetMessagesWithDisplayNameResponse,
  givenLogbook,
  givenLogbooks,
  givenSynapseLoginResponse,
} from "../helpers";

describe("LogbookController (unit)", () => {
  let controller: LogbookController;

  let synapseService: SynapseService;
  let tokenServiceManager: TokenServiceManager;
  let utils: Utils;
  let fetchAllRoomsMessages: sinon.SinonStub;
  let fetchRoomIdByName: sinon.SinonStub;
  let fetchRoomMessages: sinon.SinonStub;
  let getMessagesWithDisplayName: sinon.SinonStub;
  let sendMessage: sinon.SinonStub;

  beforeEach(givenMockSynapseServiceAndTokenManager);

  context("find", () => {
    it("resolves a list of Logbooks", async () => {
      fetchAllRoomsMessages.resolves(givenAllRoomsSyncResponse());

      const expected = givenLogbooks();
      const actual = await controller.find();
      expect(actual).to.eql(expected);
    });
  });

  context("findByName", () => {
    it("resolves in a Logbook instance matching the input name", async () => {
      fetchRoomIdByName.resolves(givenFetchRoomIdByNameResponse());
      fetchRoomMessages.resolves(givenFetchRoomMessagesResponse());
      getMessagesWithDisplayName.resolves(
        givenGetMessagesWithDisplayNameResponse(),
      );
      const expected = givenLogbook();
      const actual = await controller.findByName("123456");
      expect(actual).to.eql(expected);
    });
  });

  context("sendMessage", () => {
    it("resolves in an object containing the event_id of the sent message", async () => {
      const expected = { event_id: "$ABCDabcd1234" };
      fetchRoomIdByName.resolves(givenFetchRoomIdByNameResponse());
      sendMessage.resolves(expected);

      const actual = await controller.sendMessage("123456", {
        message: "Test",
      });
      expect(actual).to.eql(expected);
    });
  });

  function givenMockSynapseServiceAndTokenManager() {
    synapseService = {
      login: sinon.stub(),
      fetchAllRoomsMessages: sinon.stub(),
      fetchRoomIdByName: sinon.stub(),
      fetchRoomMessages: sinon.stub(),
      sendMessage: sinon.stub(),
      queryUser: sinon.stub(),
    };

    tokenServiceManager = new TokenServiceManager(new Context());

    fetchAllRoomsMessages =
      synapseService.fetchAllRoomsMessages as sinon.SinonStub;
    fetchRoomIdByName = synapseService.fetchRoomIdByName as sinon.SinonStub;
    fetchRoomMessages = synapseService.fetchRoomMessages as sinon.SinonStub;
    sendMessage = synapseService.sendMessage as sinon.SinonStub;

    tokenServiceManager.getToken = sinon
      .stub()
      .returns(givenSynapseLoginResponse().access_token);

    utils = new Utils(tokenServiceManager, synapseService);
    controller = new LogbookController(
      tokenServiceManager,
      synapseService,
      utils,
    );
    getMessagesWithDisplayName = sinon.stub(
      controller,
      "getMessagesWithDisplayName",
    );
  }
});
