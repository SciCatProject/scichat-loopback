import {Filter, repository, Where} from '@loopback/repository';
import {
  get,
  getWhereSchemaFor,
  param,
  post,
  requestBody,
  getFilterSchemaFor,
} from '@loopback/rest';
import {Room} from '../models';
import {RoomRepository} from '../repositories';

export class LogbookController {
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
  async find(@param.path.string('name') name: string): Promise<Room | null> {
    return await this.roomRepository.findOne(
      {where: {name: name}, fields: {id: true, name: true}},
      {strictObjectIDCoercion: true},
    );
  }

  parseRoom() {}

  parseMessages() {}
}
