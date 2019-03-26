import {expect} from 'chai';
import {createSandbox} from 'sinon';
import {
  findAllRoomsResponse,
  postRoomResponse,
  syncResponse,
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
    it('should sync all available rooms from Synapse to SciChat', function() {
      sandbox
        .stub(MatrixRestClient.prototype, 'findAllRooms')
        .resolves(findAllRoomsResponse);
      sandbox.stub(SyncData.prototype, 'postRoom').resolves(postRoomResponse);
      console.log('Testing');
      return sync.syncRooms().then((response: any) => {
        console.log(response);
      });
    });
  });
});
