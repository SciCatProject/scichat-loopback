'use strict';

const expect = require('chai').expect;
const sandbox = require('sinon').createSandbox();

const mockStubs = require('./MockStubs');
const MatrixRestClient = require('../common/models/matrix-rest-client');
const matrixClient = new MatrixRestClient();
const requestPromise = require('request-promise');

afterEach(function(done) {
  sandbox.restore();
  done();
});

describe('Tests for MatrixRestClient', function() {
  describe('#login', function() {
    it('should return an access token', async function() {
      sandbox
        .stub(requestPromise, 'Request')
        .resolves(mockStubs.loginResponse);
      const username = 'testName';
      const password = 'testPassword';
      const accessToken = await matrixClient.login(username, password);
      expect(accessToken).to.be.a('string');
    });
  });

  describe('#createRoom', function() {
    it('should return a roomId', async function() {
      sandbox
        .stub(requestPromise, 'Request')
        .resolves(mockStubs.createRoomResponse);
      const accessToken = 'testToken';
      const name = 'test';
      const invites = [];
      const response = await matrixClient.createRoom(
        accessToken,
        name,
        invites
      );
      expect(response).to.have.property('room_id');
    });
  });

  describe('#fetchPublicRooms', function() {
    it('should return an array of rooms', async function() {
      sandbox
        .stub(requestPromise, 'Request')
        .resolves(mockStubs.fetchPublicRoomsResponse);
      const accessToken = 'testToken';
      const rooms = await matrixClient.fetchPublicRooms(accessToken);
      expect(rooms).to.be.an('array');
      rooms.forEach(room => {
        expect(room).to.have.property('name');
        expect(room).to.have.property('room_id');
      });
    });
  });

  describe('#fetchRoomIdByName', function() {
    it('should return a roomId', async function() {
      sandbox
        .stub(requestPromise, 'Request')
        .resolves(mockStubs.fetchRoomIdByNameResponse);
      const name = '23PTEG';
      const roomId = await matrixClient.fetchRoomIdByName(name);
      expect(roomId).to.be.a('string');
    });
  });

  describe('#fetchAllRoomsMessages', function() {
    it('should return an array of Logbook objects', async function() {
      sandbox
        .stub(requestPromise, 'Request')
        .resolves(mockStubs.fetchRoomMessagesResponse);
      const accessToken = 'testToken';
      const logbooks = await matrixClient.fetchAllRoomsMessages(
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
        .stub(requestPromise, 'Request')
        .resolves(mockStubs.fetchRoomMessagesResponse);

      const roomId = '!testId';
      const accessToken = 'testToken';
      const logbook = await matrixClient.fetchRoomMessages(roomId, accessToken);
      expect(logbook).to.be.an('object');
      expect(logbook).to.have.property('name');
      expect(logbook).to.have.property('roomId');
      expect(logbook.roomId).to.equal(roomId);
      expect(logbook).to.have.property('messages');
    });
  });
});
