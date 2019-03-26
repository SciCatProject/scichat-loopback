import {expect} from 'chai';
import {createSandbox} from 'sinon';
import {
  findAllRoomsResponse,
  getRoomsResponse,
  postRoomResponse,
  syncResponse,
  emptyArray,
  emptyObject,
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
          expect(room).to.be.an('object');
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
});
