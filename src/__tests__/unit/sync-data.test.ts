import {expect} from 'chai';
import {createSandbox} from 'sinon';
import {
  findAllRoomsResponse,
  getRoomsResponse,
  postRoomResponse,
  syncResponse,
  emptyArray,
  emptyObject,
  postRoomEventResponse,
  getEventsResponse,
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
    it('should return an array of synced Room objects', function() {
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

    it('should return an array of empty objects', function() {
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
    it('should return an array of synced Room Event objects', function() {
      sandbox.stub(MatrixRestClient.prototype, 'sync').resolves(syncResponse);
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
    it('should return an array of empty objects', function() {
      sandbox.stub(MatrixRestClient.prototype, 'sync').resolves(syncResponse);
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
});
