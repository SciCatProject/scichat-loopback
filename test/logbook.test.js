'use strict';

const expect = require('chai').expect;
const request = require('supertest');
const sandbox = require('sinon').createSandbox();
const rison = require('rison');

const mockStubs = require('./MockStubs');
const utils = require('./loginUtils');
const MatrixRestClient = require('../common/models/matrix-rest-client');

let app, accessToken;
before(function(done) {
  app = require('../server/server');
  done();
});

afterEach(function(done) {
  sandbox.restore();
  done();
});

describe('Tests for Logbook model', function() {
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

  describe('#findByName', function() {
    it('should fetch a Logbook by name', function(done) {
      sandbox
        .stub(MatrixRestClient.prototype, 'fetchRoomIdByName')
        .resolves(mockStubs.fetchRoomIdByNameResponse.room_id);
      sandbox
        .stub(MatrixRestClient.prototype, 'fetchRoomMessages')
        .resolves(mockStubs.findLogbookResponse);

      const name = 'testRoom';
      request(app)
        .get('/api/Logbooks/' + name + '?access_token=' + accessToken)
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('name');
          expect(res.body.name).to.equal(name);
          done();
        });
    });
  });

  describe('#findAll', function() {
    it('should fetch all Logbooks', function(done) {
      sandbox
        .stub(MatrixRestClient.prototype, 'fetchAllRoomsMessages')
        .resolves(mockStubs.findAllLogbooksResponse);

      request(app)
        .get('/api/Logbooks?access_token=' + accessToken)
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          expect(res.body).to.be.an('array');
          res.body.forEach(logbook => {
            expect(logbook).to.have.property('roomId');
            expect(logbook).to.have.property('name');
            expect(logbook).to.have.property('messages');
          });
          done();
        });
    });
  });

  describe('#filter', function() {
    it('should fetch filtered Logbook by name', function(done) {
      sandbox
        .stub(MatrixRestClient.prototype, 'fetchRoomIdByName')
        .resolves(mockStubs.fetchRoomIdByNameResponse.room_id);
      sandbox
        .stub(MatrixRestClient.prototype, 'fetchRoomMessages')
        .resolves(mockStubs.findLogbookResponse);

      const name = 'testRoom';
      const filter = rison.encode_object({
        showBotMessages: true,
        showUserMessages: true,
        showImages: true,
        textSearch: '',
      });
      request(app)
        .get(
          '/api/Logbooks/' +
            name +
            '/' +
            filter +
            '?access_token=' +
            accessToken
        )
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('name');
          expect(res.body.name).to.equal(name);
          done();
        });
    });
  });
});
