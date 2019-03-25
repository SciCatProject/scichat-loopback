import {Client, expect} from '@loopback/testlab';
import {ScichatLoopbackApplication} from '../..';
import {setupApplication} from './test-helper';

let newRoom = {
  canonicalAlias: 'string',
  name: 'string',
  worldReadable: false,
  topic: 'string',
  numberOfJoinedMembers: 1,
  federate: false,
  roomId: '!string',
  guestCanJoin: false,
  aliases: ['#string'],
};

describe('RoomController', () => {
  let app: ScichatLoopbackApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  // it('invokes POST /rooms', async () => {
  //   const res = await client
  //     .post('/rooms')
  //     .send(newRoom)
  //     .expect(200);
  //   expect(res.body).to.be.an.Object;
  //   expect(res.body).to.have.key('id');
  //   expect(res.body.id).to.be.a.String;
  // });

  it('invokes GET /rooms', async () => {
    const res = await client.get('/rooms').expect(200);
    expect(res.body).to.be.an.Array;
    res.body.forEach((room: any) => {
      expect(room).to.be.an.Object;
      expect(room).to.have.key('id');
      expect(room.id).to.be.a.String;
    });
  });
});
