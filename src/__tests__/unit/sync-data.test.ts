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
  findRoomMembersResponse,
  postRoomMemberResponse,
  getMembersResponse,
} from './MockStubs';

const sandbox = createSandbox();

const SyncData = require('../../../sync-data/SyncData');
const sync = new SyncData();
const MatrixRestClient = require('../../../sync-data/matrix-rest-client');
const LoopbackClient = require('../../../sync-data/LoopbackClient');

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
      sandbox.stub(LoopbackClient.prototype, 'getRooms').resolves(emptyArray);
      sandbox
        .stub(LoopbackClient.prototype, 'postRoom')
        .resolves(postRoomResponse);
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
      sandbox
        .stub(LoopbackClient.prototype, 'getRooms')
        .resolves(getRoomsResponse);
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
      sandbox
        .stub(LoopbackClient.prototype, 'getRooms')
        .resolves(getRoomsResponse);
      sandbox.stub(LoopbackClient.prototype, 'getEvents').resolves(emptyArray);
      sandbox
        .stub(LoopbackClient.prototype, 'postRoomEvent')
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
      sandbox
        .stub(LoopbackClient.prototype, 'getRooms')
        .resolves(getRoomsResponse);
      sandbox
        .stub(LoopbackClient.prototype, 'getEvents')
        .resolves(getEventsResponse);
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
      sandbox
        .stub(LoopbackClient.prototype, 'getRooms')
        .resolves(getRoomsResponse);
      sandbox
        .stub(LoopbackClient.prototype, 'getMessages')
        .resolves(emptyArray);
      sandbox
        .stub(LoopbackClient.prototype, 'postRoomMessage')
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
      sandbox
        .stub(LoopbackClient.prototype, 'getRooms')
        .resolves(getRoomsResponse);
      sandbox
        .stub(LoopbackClient.prototype, 'getMessages')
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
  describe('#syncRoomMembers()', function() {
    it('should return an array of synced Room Member objects when eventId is not in db', function() {
      sandbox
        .stub(MatrixRestClient.prototype, 'findRoomMembers')
        .resolves(findRoomMembersResponse);
      sandbox
        .stub(LoopbackClient.prototype, 'getRooms')
        .resolves(getRoomsResponse);
      sandbox.stub(LoopbackClient.prototype, 'getMembers').resolves(emptyArray);
      sandbox
        .stub(LoopbackClient.prototype, 'postRoomMember')
        .resolves(postRoomMemberResponse);
      return sync.syncRoomMembers().then((roomMembers: any) => {
        expect(roomMembers).to.be.an('array');
        roomMembers.forEach((members: any) => {
          expect(members).to.be.an('array');
          members.forEach((member: any) => {
            expect(member).to.be.an('object').that.is.not.empty;
          });
        });
      });
    });
    it('should return an array of empty objects when eventId is already in db', function() {
      sandbox
        .stub(MatrixRestClient.prototype, 'findRoomMembers')
        .resolves(findRoomMembersResponse);
      sandbox
        .stub(LoopbackClient.prototype, 'getRooms')
        .resolves(getRoomsResponse);
      sandbox
        .stub(LoopbackClient.prototype, 'getMembers')
        .resolves(getMembersResponse);
      return sync.syncRoomMembers().then((roomMembers: any) => {
        expect(roomMembers).to.be.an('array');
        roomMembers.forEach((members: any) => {
          expect(members).to.be.an('array');
          members.forEach((member: any) => {
            expect(member).to.be.an('object').that.is.empty;
          });
        });
      });
    });
  });
});
