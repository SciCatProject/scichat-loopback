'use strict';

const bluebird = require('bluebird');
const chai = require('chai');
const expect = chai.expect;
const sandbox = require('sinon').createSandbox();

const syncData = require('../../../sync-data/index');
const mockStubs = require('./MockStubs');

afterEach(function(done) {
  sandbox.restore();
  done();
});

describe('Unit tests for sync-data', function() {
  describe('#syncRooms()', function() {
    it('should sync all available rooms from Synapse to SciChat', function() {});
    sandbox.stub();
    return syncData.syncRooms();
  });
});
