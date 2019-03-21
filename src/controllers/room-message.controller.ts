import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {Message} from '../models';
import {RoomRepository} from '../repositories';

export class RoomMessageController {
  constructor(@repository(RoomRepository) protected roomRepo: RoomRepository) {}

  @post('/room/{id}/messages', {
    responses: {
      '200': {
        description: 'Room.Message model instance',
        content: {'application/json': {schema: {'x-ts-type': Message}}},
      },
    },
  })
  async create(
    @param.path.string('id') id: string,
    @requestBody() message: Message,
  ): Promise<Message> {
    return await this.roomRepo.messages(id).create(message);
  }

  @get('/room/{id}/messages', {
    responses: {
      '200': {
        description: 'Array of Messages belonging to Room',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Message}},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter,
  ): Promise<Message[]> {
    return await this.roomRepo.messages(id).find(filter);
  }

  @patch('/room/{id}/messages', {
    responses: {
      '200': {
        description: 'Room.Message PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody() message: Partial<Message>,
    @param.query.object('where', getWhereSchemaFor(Message)) where?: Where,
  ): Promise<Count> {
    return await this.roomRepo.messages(id).patch(message, where);
  }

  @del('/room/{id}/messages', {
    responses: {
      '200': {
        description: 'Room.Message DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Message)) where?: Where,
  ): Promise<Count> {
    return await this.roomRepo.messages(id).delete(where);
  }
}
