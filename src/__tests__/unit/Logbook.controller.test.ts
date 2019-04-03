import {Client, expect} from '@loopback/testlab';
import {ScichatLoopbackApplication} from '../..';
import {setupApplication} from '../acceptance/test-helper';
import {createSandbox} from 'sinon';
import {findOneRoomResponse, getMessagesResponse} from './MockStubs';

import {MessageRepository, RoomRepository} from '../../repositories';

const sandbox = createSandbox();

afterEach(function(done) {
  sandbox.restore();
  done();
});

describe('Unit test for Logbook controller', function() {
  let app: ScichatLoopbackApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('should return an object containing Room name and an array of Messages', async () => {
    sandbox
      .stub(RoomRepository.prototype, 'findOne')
      .resolves(findOneRoomResponse);
    sandbox
      .stub(MessageRepository.prototype, 'find')
      .resolves(getMessagesResponse);
    let name = 'string';
    const res = await client.get(`/logbooks/${name}`);
    expect(res.body).to.be.an.Object;
    expect(res.body).to.have.properties(['name', 'messages']);
    expect(res.body.messages).to.be.an.Array;
    res.body.messages.forEach((message: any) => {
      expect(message).to.have.properties(['timestamp', 'sender', 'content']);
    });
  });
});
