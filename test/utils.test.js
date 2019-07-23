/* eslint-disable camelcase */
'use strict';

const expect = require('chai').expect;

const Utils = require('../common/models/utils');
const utils = new Utils();

const testRoom = {
  canonical_alias: 'string',
  name: 'string',
  world_readable: false,
  topic: 'string',
  num_joined_members: 3,
  'm.federate': false,
  room_id: '!string',
  guest_can_join: false,
  aliases: ['#string'],
};

describe('Unit tests for utils', function() {
  describe('#applyRequestOptionsFor', function() {
    it('should return a request options object for login', function() {
      const loginOptions = {
        username: 'myUser',
        password: 'myPassword',
      };
      const loginRequestOptions = utils.applyRequestOptionsFor(
        'login',
        loginOptions
      );
      expect(loginRequestOptions).to.be.an('object');
      expect(loginRequestOptions.method).to.equal('POST');
      expect(loginRequestOptions.body.identifier.user).to.equal(
        loginOptions.username
      );
      expect(loginRequestOptions.body.password).to.equal(loginOptions.password);
    });
  });
  describe('#applyFilter', function() {
    it('should return a stringified JSON filter object', function() {
      const filterOptions = {
        room: testRoom,
        queryFilter: {
          showBotMessages: true,
          showImages: true,
          showUserMessages: true,
          textQuery: '',
        },
      };
      const filter = utils.applyFilter(filterOptions);
      expect(filter).to.be.a('string');
    });
  });
});
