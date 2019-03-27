import {expect} from 'chai';
import {createSandbox} from 'sinon';
import {
  findAllRoomsResponse,
  findEventsByRoomResponse,
  getRoomsResponse,
  postRoomResponse,
  emptyArray,
  emptyObject,
  postRoomEventResponse,
  getEventsResponse,
  findMessagesByRoomResponse,
  postRoomMessageResponse,
  getMessagesResponse,
} from './MockStubs';

const sandbox = createSandbox();

const SyncData = require('../../../sync-data/SyncData');
const sync = new SyncData();
const MatrixRestClient = require('../../../sync-data/matrix-rest-client');

afterEach(function(done) {
  sandbox.restore();
  done();
});

describe('Unit tests for sync-data', function() {
  describe('#syncRooms()', function() {
    it('should return an array of synced Room objects when roomId is not in db', function() {
      sandbox
        .stub(MatrixRestClient.prototype, 'findAllRooms')
        .resolves(findAllRoomsResponse);
      sandbox.stub(SyncData.prototype, 'getRooms').resolves(emptyArray);
      sandbox.stub(SyncData.prototype, 'postRoom').resolves(postRoomResponse);
      return sync.syncRooms().then((rooms: any) => {
        expect(rooms).to.be.an('array');
        rooms.forEach((room: any) => {
          expect(room).to.be.an('object').that.is.not.empty;
        });
      });
    });

    it('should return an array of empty objects when roomId is already in db', function() {
      sandbox
        .stub(MatrixRestClient.prototype, 'findAllRooms')
        .resolves(findAllRoomsResponse);
      sandbox.stub(SyncData.prototype, 'getRooms').resolves(getRoomsResponse);
      return sync.syncRooms().then((rooms: any) => {
        expect(rooms).to.be.an('array');
        rooms.forEach((room: any) => {
          expect(room).to.be.an('object').that.is.empty;
        });
      });
    });
  });

  describe('#syncRoomEvents()', function() {
    it('should return an array of synced Room Event objects when eventId is not in db', function() {
      sandbox
        .stub(MatrixRestClient.prototype, 'findEventsByRoom')
        .resolves(findEventsByRoomResponse);
      sandbox.stub(SyncData.prototype, 'getRooms').resolves(getRoomsResponse);
      sandbox.stub(SyncData.prototype, 'getEvents').resolves(emptyArray);
      sandbox
        .stub(SyncData.prototype, 'postRoomEvent')
        .resolves(postRoomEventResponse);
      return sync.syncRoomEvents().then((roomEvents: any) => {
        expect(roomEvents).to.be.an('array');
        roomEvents.forEach((events: any) => {
          expect(events).to.be.an('array');
          events.forEach((event: any) => {
            expect(event).to.be.an('object').that.is.not.empty;
          });
        });
      });
    });
    it('should return an array of empty objects when eventId is already in db', function() {
      sandbox
        .stub(MatrixRestClient.prototype, 'findEventsByRoom')
        .resolves(findEventsByRoomResponse);
      sandbox.stub(SyncData.prototype, 'getRooms').resolves(getRoomsResponse);
      sandbox.stub(SyncData.prototype, 'getEvents').resolves(getEventsResponse);
      return sync.syncRoomEvents().then((roomEvents: any) => {
        expect(roomEvents).to.be.an('array');
        roomEvents.forEach((events: any) => {
          expect(events).to.be.an('array');
          events.forEach((event: any) => {
            expect(event).to.be.an('object').that.is.empty;
          });
        });
      });
    });
  });
  describe('#syncRoomMessages', function() {
    it('should return an array of synced Room Message objects when eventId is not in db', function() {
      sandbox
        .stub(MatrixRestClient.prototype, 'findMessagesByRoom')
        .resolves(findMessagesByRoomResponse);
      sandbox.stub(SyncData.prototype, 'getRooms').resolves(getRoomsResponse);
      sandbox.stub(SyncData.prototype, 'getMessages').resolves(emptyArray);
      sandbox
        .stub(SyncData.prototype, 'postRoomMessage')
        .resolves(postRoomMessageResponse);
      return sync.syncRoomMessages().then((roomMessages: any) => {
        expect(roomMessages).to.be.an('array');
        roomMessages.forEach((messages: any) => {
          expect(messages).to.be.an('array');
          messages.forEach((message: any) => {
            expect(message).to.be.an('object').that.is.not.empty;
          });
        });
      });
    });
    it('should return an array of empty objects when eventId is already in db', function() {
      sandbox
        .stub(MatrixRestClient.prototype, 'findMessagesByRoom')
        .resolves(findMessagesByRoomResponse);
      sandbox.stub(SyncData.prototype, 'getRooms').resolves(getRoomsResponse);
      sandbox
        .stub(SyncData.prototype, 'getMessages')
        .resolves(getMessagesResponse);
      return sync.syncRoomMessages().then((roomMessages: any) => {
        expect(roomMessages).to.be.an('array');
        roomMessages.forEach((messages: any) => {
          expect(messages).to.be.an('array');
          messages.forEach((message: any) => {
            expect(message).to.be.an('object').that.is.empty;
          });
        });
      });
    });
  });
});
