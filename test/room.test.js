'use strict';

const expect = require('chai').expect;
const request = require('supertest');
const sandbox = require('sinon').createSandbox();

const mockStubs = require('./MockStubs');
const utils = require('./loginUtils');
const MatrixRestClient = require('../common/models/matrix-rest-client');

let app, accessToken;
before(function() {
  app = require('../server/server');
});

describe('Tests for Room model', function() {
  before(function(done) {
    const user = {
      username: 'logbookReader',
      password: 'logrdr',
    };
    utils.getToken(app, user, tokenVal => {
      accessToken = tokenVal;
      done();
    });
  });
  describe('#createRoom', function() {
    it('should create a new Synapse chat room', function(done) {
      sandbox
        .stub(MatrixRestClient.prototype, 'createRoom')
        .resolves(mockStubs.createRoomResponse);
      const roomData = {
        name: 'ABC123',
        invites: ['firstnamelastname'],
      };
      request(app)
        .post('/api/Rooms?access_token=' + accessToken)
        .set('Accept', 'application/json')
        .send(roomData)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('room_id');
          done();
        });
    });
  });
});