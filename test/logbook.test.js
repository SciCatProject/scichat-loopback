'use strict';

const expect = require('chai').expect;
const request = require('supertest');
const rison = require('rison');

const utils = require('./loginUtils');

let app, accessToken;
before(function() {
  app = require('../server/server');
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
    it('should fetch a Logbook name 23PTEG', function(done) {
      const name = '23PTEG';
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
    it('should fetch filtered Logbook 23PTEG', function(done) {
      const name = '23PTEG';
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
