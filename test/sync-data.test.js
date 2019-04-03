/* eslint-disable no-unused-expressions */
/* eslint-disable max-len */
'use strict';

const expect = require('chai').expect;
const sandbox = require('sinon').createSandbox();

const mockStubs = require('./MockStubs');

const LoopbackClient = require('../sync-data/loopback-client');
const MatrixRestClient = require('../sync-data/matrix-rest-client');
const SyncData = require('../sync-data/sync-data');
const sync = new SyncData();

afterEach(function(done) {
  sandbox.restore();
  done();
});

describe('Unit tests for sync-data', function() {
  describe('#syncRooms()', function() {
    it('should return an array of synced Room objects when roomId is not in db', function() {
      sandbox
        .stub(MatrixRestClient.prototype, 'findAllRooms')
        .resolves(mockStubs.findAllRoomsResponse);
      sandbox
        .stub(LoopbackClient.prototype, 'getRooms')
        .resolves(mockStubs.emptyArray);
      sandbox
        .stub(LoopbackClient.prototype, 'postRoom')
        .resolves(mockStubs.postRoomResponse);
      return sync.syncRooms().then(rooms => {
        expect(rooms).to.be.an('array');
        rooms.forEach(room => {
          expect(room).to.be.an('object').that.is.not.empty;
        });
      });
    });

    it('should return an array of empty objects when roomId is already in db', function() {
      sandbox
        .stub(MatrixRestClient.prototype, 'findAllRooms')
        .resolves(mockStubs.findAllRoomsResponse);
      sandbox
        .stub(LoopbackClient.prototype, 'getRooms')
        .resolves(mockStubs.getRoomsResponse);
      return sync.syncRooms().then(rooms => {
        expect(rooms).to.be.an('array');
        rooms.forEach(room => {
          expect(room).to.be.an('object').that.is.empty;
        });
      });
    });
  });

  describe('#syncRoomEvents()', function() {
    it('should return an array of synced Room Event objects when eventId is not in db', function() {
      sandbox
        .stub(MatrixRestClient.prototype, 'findEventsByRoom')
        .resolves(mockStubs.findEventsByRoomResponse);
      sandbox
        .stub(LoopbackClient.prototype, 'getRooms')
        .resolves(mockStubs.getRoomsResponse);
      sandbox
        .stub(LoopbackClient.prototype, 'getEvents')
        .resolves(mockStubs.emptyArray);
      sandbox
        .stub(LoopbackClient.prototype, 'postRoomEvent')
        .resolves(mockStubs.postRoomEventResponse);
      return sync.syncRoomEvents().then(roomEvents => {
        expect(roomEvents).to.be.an('array');
        roomEvents.forEach(events => {
          expect(events).to.be.an('array');
          events.forEach(event => {
            expect(event).to.be.an('object').that.is.not.empty;
          });
        });
      });
    });
    it('should return an array of empty objects when eventId is already in db', function() {
      sandbox
        .stub(MatrixRestClient.prototype, 'findEventsByRoom')
        .resolves(mockStubs.findEventsByRoomResponse);
      sandbox
        .stub(LoopbackClient.prototype, 'getRooms')
        .resolves(mockStubs.getRoomsResponse);
      sandbox
        .stub(LoopbackClient.prototype, 'getEvents')
        .resolves(mockStubs.getEventsResponse);
      return sync.syncRoomEvents().then(roomEvents => {
        expect(roomEvents).to.be.an('array');
        roomEvents.forEach(events => {
          expect(events).to.be.an('array');
          events.forEach(event => {
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
        .resolves(mockStubs.findMessagesByRoomResponse);
      sandbox
        .stub(LoopbackClient.prototype, 'getRooms')
        .resolves(mockStubs.getRoomsResponse);
      sandbox
        .stub(LoopbackClient.prototype, 'getMessages')
        .resolves(mockStubs.emptyArray);
      sandbox
        .stub(LoopbackClient.prototype, 'postRoomMessage')
        .resolves(mockStubs.postRoomMessageResponse);
      return sync.syncRoomMessages().then(roomMessages => {
        expect(roomMessages).to.be.an('array');
        roomMessages.forEach(messages => {
          expect(messages).to.be.an('array');
          messages.forEach(message => {
            expect(message).to.be.an('object').that.is.not.empty;
          });
        });
      });
    });
    it('should return an array of empty objects when eventId is already in db', function() {
      sandbox
        .stub(MatrixRestClient.prototype, 'findMessagesByRoom')
        .resolves(mockStubs.findMessagesByRoomResponse);
      sandbox
        .stub(LoopbackClient.prototype, 'getRooms')
        .resolves(mockStubs.getRoomsResponse);
      sandbox
        .stub(LoopbackClient.prototype, 'getMessages')
        .resolves(mockStubs.getMessagesResponse);
      return sync.syncRoomMessages().then(roomMessages => {
        expect(roomMessages).to.be.an('array');
        roomMessages.forEach(messages => {
          expect(messages).to.be.an('array');
          messages.forEach(message => {
            expect(message).to.be.an('object').that.is.empty;
          });
        });
      });
    });
  });
  describe('#syncRoomMembers()', function() {
    it('should return an array of synced Room Member objects when eventId is not in db', function() {
      sandbox
        .stub(MatrixRestClient.prototype, 'findRoomMembers')
        .resolves(mockStubs.findRoomMembersResponse);
      sandbox
        .stub(LoopbackClient.prototype, 'getRooms')
        .resolves(mockStubs.getRoomsResponse);
      sandbox
        .stub(LoopbackClient.prototype, 'getMembers')
        .resolves(mockStubs.emptyArray);
      sandbox
        .stub(LoopbackClient.prototype, 'postRoomMember')
        .resolves(mockStubs.postRoomMemberResponse);
      return sync.syncRoomMembers().then(roomMembers => {
        expect(roomMembers).to.be.an('array');
        roomMembers.forEach(members => {
          expect(members).to.be.an('array');
          members.forEach(member => {
            expect(member).to.be.an('object').that.is.not.empty;
          });
        });
      });
    });
    it('should return an array of empty objects when eventId is already in db', function() {
      sandbox
        .stub(MatrixRestClient.prototype, 'findRoomMembers')
        .resolves(mockStubs.findRoomMembersResponse);
      sandbox
        .stub(LoopbackClient.prototype, 'getRooms')
        .resolves(mockStubs.getRoomsResponse);
      sandbox
        .stub(LoopbackClient.prototype, 'getMembers')
        .resolves(mockStubs.getMembersResponse);
      return sync.syncRoomMembers().then(roomMembers => {
        expect(roomMembers).to.be.an('array');
        roomMembers.forEach(members => {
          expect(members).to.be.an('array');
          members.forEach(member => {
            expect(member).to.be.an('object').that.is.empty;
          });
        });
      });
    });
  });
  describe('#syncRoomImages()', function() {
    it('should return an array of synced Room Image objects when eventId is not in db', function() {
      sandbox
        .stub(MatrixRestClient.prototype, 'findAllImagesByRoom')
        .resolves(mockStubs.findAllImagesByRoomResponse);
      sandbox
        .stub(LoopbackClient.prototype, 'getRooms')
        .resolves(mockStubs.getRoomsResponse);
      sandbox
        .stub(LoopbackClient.prototype, 'getImages')
        .resolves(mockStubs.emptyArray);
      sandbox
        .stub(LoopbackClient.prototype, 'postRoomImage')
        .resolves(mockStubs.postImageResponse);
      return sync.syncRoomImages().then(roomImages => {
        expect(roomImages).to.be.an('array');
        roomImages.forEach(images => {
          expect(images).to.be.an('array');
          images.forEach(image => {
            expect(image).to.be.an('object').that.is.not.empty;
          });
        });
      });
    });
    it('should return an array of empty objects when eventId is already in db', function() {
      sandbox
        .stub(MatrixRestClient.prototype, 'findAllImagesByRoom')
        .resolves(mockStubs.findAllImagesByRoomResponse);
      sandbox
        .stub(LoopbackClient.prototype, 'getRooms')
        .resolves(mockStubs.getRoomsResponse);
      sandbox
        .stub(LoopbackClient.prototype, 'getImages')
        .resolves(mockStubs.getImagesResponse);
      return sync.syncRoomImages().then(roomImages => {
        expect(roomImages).to.be.an('array');
        roomImages.forEach(images => {
          expect(images).to.be.an('array');
          images.forEach(image => {
            expect(image).to.be.an('object').that.is.empty;
          });
        });
      });
    });
  });
});
