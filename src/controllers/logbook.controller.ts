import {Filter, repository} from '@loopback/repository';
import {get, param} from '@loopback/rest';
import {Room} from '../models';
import {RoomRepository} from '../repositories';

export class LogbookController {
  room: Room;
  constructor(
    @repository(RoomRepository)
    protected roomRepository: RoomRepository,
  ) {}

  @get('/logbooks/{name}', {
    responses: {
      '200': {
        description: 'Custom Logbook instance',
        content: {'application/json': {schema: {'x-ts-type': Room}}},
      },
    },
  })
  async find(
    @param.path.string('name') name: string,
    @param.query.object('filter') filter?: Filter,
  ): Promise<any> {
    return await this.roomRepository
      .findOne({
        where: {name: name},
      })
      .then(async room => {
        if (room !== null && room !== undefined && room.id !== undefined) {
          this.room = room;
          return await this.roomRepository
            .messages(room.id)
            .find(filter, {strictObjectIDCoercion: true});
        } else {
          return new Promise((resolve, reject) => {
            resolve(undefined);
          });
        }
      })
      .then(messages => {
        if (messages !== null && messages !== undefined) {
          let logbook = JSON.stringify(this.parseLogbook(this.room, messages));
          return new Promise((resolve, reject) => {
            resolve(logbook);
          });
        } else {
          return new Promise((resolve, reject) => {
            resolve(undefined);
          });
        }
      });
  }

  parseLogbook(room: Room, messages: any): Object {
    interface LooseObject {
      [key: string]: any;
    }
    let newLogbook: LooseObject = {
      name: room.name,
      messages: [],
    };
    messages.forEach(
      (message: {
        timestamp: string | number | Date | undefined;
        sender: any;
        content: any;
      }) => {
        let parsedMessage: LooseObject = {};
        if (message.timestamp !== undefined) {
          parsedMessage.timestamp = new Date(message.timestamp).toISOString();
        } else {
          parsedMessage.timestamp = undefined;
        }
        parsedMessage.sender = message.sender;
        parsedMessage.content = message.content;
        newLogbook.messages.push(parsedMessage);
      },
    );
    return newLogbook;
  }
}
