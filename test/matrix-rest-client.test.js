'use strict';

const expect = require('chai').expect;
const sandbox = require('sinon').createSandbox();

const mockStubs = require('./MockStubs');
const config = require('../server/config.local');
const MatrixRestClient = require('../common/models/matrix-rest-client');
const matrixClient = new MatrixRestClient();

afterEach(function(done) {
  sandbox.restore();
  done();
});

describe('Tests for MatrixRestClient', function() {
  let accessToken;
  let rooms;
  let room;
  describe('#login', function() {
    it('should return an access token', async function() {
      sandbox
        .stub(MatrixRestClient.prototype, 'login')
        .resolves(mockStubs.loginResponse);
      const username = config.synapse.bot.name;
      const password = config.synapse.bot.name;
      accessToken = await matrixClient.login(username, password);
      expect(accessToken).to.be.a('string');
    });
  });
  describe('#fetchRooms', function() {
    it('should return an array of rooms', async function() {
      sandbox
        .stub(MatrixRestClient.prototype, 'fetchRooms')
        .resolves(mockStubs.fetchRoomsResponse);
      rooms = await matrixClient.fetchRooms(accessToken);
      expect(rooms).to.be.an('array');
      rooms.forEach(room => {
        expect(room).to.have.property('name');
        expect(room).to.have.property('room_id');
      });
    });
  });
  describe('#fetchRoomByName', function() {
    it('should return the room 23PTEG', async function() {
      sandbox
        .stub(MatrixRestClient.prototype, 'fetchRoomByName')
        .resolves(mockStubs.fetchRoomByNameResponse);
      const name = '23PTEG';
      room = await matrixClient.fetchRoomByName(name, accessToken);
      expect(room).to.be.an('object');
      expect(room).to.have.property('name');
      expect(room).to.have.property('room_id');
    });
  });
  describe('#fetchAllRoomsMessages', function() {
    it('should return an array of Logbook objects', async function() {
      sandbox
        .stub(MatrixRestClient.prototype, 'fetchAllRoomsMessages')
        .resolves(mockStubs.fetchAllRoomsMessagesResponse);
      const logbooks = await matrixClient.fetchAllRoomsMessages(
        rooms,
        accessToken
      );
      expect(logbooks).to.be.an('array');
      logbooks.forEach(logbook => {
        expect(logbook).to.have.property('name');
        expect(logbook).to.have.property('roomId');
        expect(logbook).to.have.property('messages');
      });
    });
  });
  describe('#fetchRoomMessages', function() {
    it('should return a Logbook object', async function() {
      sandbox
        .stub(MatrixRestClient.prototype, 'fetchRoomMessages')
        .resolves(mockStubs.fetchRoomMessagesResponse);
      const logbook = await matrixClient.fetchRoomMessages(room, accessToken);
      expect(logbook).to.be.an('object');
      expect(logbook).to.have.property('name');
      expect(logbook).to.have.property('roomId');
      expect(logbook).to.have.property('messages');
    });
  });
});
