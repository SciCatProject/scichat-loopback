import { expect } from "@loopback/testlab";
import sinon from "sinon";
import { LogbookController } from "../../controllers";
import { MongodbDataSource } from "../../datasources";
import { SynapseTokenRepository } from "../../repositories";
import { SynapseService } from "../../services";
import { testdb } from "../fixtures/datasources/testdb.datasource";
import {
  givenAllRoomsSyncResponse,
  givenCreateRoomResponse,
  givenFetchRoomIdByNameResponse,
  givenFetchRoomMessagesResponse,
  givenLogbook,
  givenLogbooks,
  givenSynapseLoginResponse,
} from "../helpers";

describe("LogbookController (unit)", () => {
  let controller: LogbookController;

  let synapseService: SynapseService;
  let login: sinon.SinonStub;
  let createRoom: sinon.SinonStub;
  let fetchAllRoomsMessages: sinon.SinonStub;
  let fetchRoomIdByName: sinon.SinonStub;
  let fetchRoomMessages: sinon.SinonStub;
  let sendMessage: sinon.SinonStub;

  beforeEach(givenMockSynapseService);

  context("find", () => {
    it("resolves a list of Logbooks", async () => {
      login.resolves(givenSynapseLoginResponse());
      fetchAllRoomsMessages.resolves(givenAllRoomsSyncResponse());

      const expected = givenLogbooks();

      expect(await controller.find()).to.eql(expected);
    });
  });

  context("create", () => {
    it("resolves in an object containing the room_alias and room_id", async () => {
      const details = { name: "098765" };
      login.resolves(givenSynapseLoginResponse());
      createRoom.resolves(givenCreateRoomResponse(details));

      const expected = givenCreateRoomResponse(details);

      expect(await controller.create(details)).to.eql(expected);
    });
  });

  context("findByName", () => {
    it("resolves in a Logbook instance matching the input name", async () => {
      login.resolves(givenSynapseLoginResponse());
      fetchRoomIdByName.resolves(givenFetchRoomIdByNameResponse());
      fetchRoomMessages.resolves(givenFetchRoomMessagesResponse());

      const expected = givenLogbook();

      expect(await controller.findByName("123456")).to.eql(expected);
    });
  });

  context("sendMessage", () => {
    it("resolves in an object containing the event_id of the sent message", async () => {
      const expected = { event_id: "$ABCDabcd1234" };
      login.resolves(givenSynapseLoginResponse());
      fetchRoomIdByName.resolves(givenFetchRoomIdByNameResponse());
      sendMessage.resolves(expected);

      expect(
        await controller.sendMessage("123456", { message: "Test" }),
      ).to.eql(expected);
    });
  });

  function givenMockSynapseService() {
    synapseService = {
      login: sinon.stub(),
      createRoom: sinon.stub(),
      fetchAllRoomsMessages: sinon.stub(),
      fetchRoomIdByName: sinon.stub(),
      fetchRoomMessages: sinon.stub(),
      sendMessage: sinon.stub(),
    };

    login = synapseService.login as sinon.SinonStub;
    createRoom = synapseService.createRoom as sinon.SinonStub;
    fetchAllRoomsMessages = synapseService.fetchAllRoomsMessages as sinon.SinonStub;
    fetchRoomIdByName = synapseService.fetchRoomIdByName as sinon.SinonStub;
    fetchRoomMessages = synapseService.fetchRoomMessages as sinon.SinonStub;
    sendMessage = synapseService.sendMessage as sinon.SinonStub;

    const mongodb = new MongodbDataSource(testdb);
    const synapseTokenRepositry = new SynapseTokenRepository(mongodb);
    controller = new LogbookController(synapseTokenRepositry, synapseService);
  }
});
