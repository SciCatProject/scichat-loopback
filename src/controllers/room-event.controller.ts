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
import {Event} from '../models';
import {RoomRepository} from '../repositories';

export class RoomEventController {
  constructor(@repository(RoomRepository) protected roomRepo: RoomRepository) {}

  @post('/room/{id}/events', {
    responses: {
      '200': {
        description: 'Room.Event model instance',
        content: {'application/json': {schema: {'x-ts-type': Event}}},
      },
    },
  })
  async create(
    @param.path.number('id') id: number,
    @requestBody() event: Event,
  ): Promise<Event> {
    return await this.roomRepo.events(id).create(event);
  }

  @get('/room/{id}/events', {
    responses: {
      '200': {
        description: 'Array of Events belonging to Room',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Event}},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter,
  ): Promise<Event[]> {
    return await this.roomRepo.events(id).find(filter);
  }

  @patch('/room/{id}/events', {
    responses: {
      '200': {
        description: 'Room.Event PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody() event: Partial<Event>,
    @param.query.object('where', getWhereSchemaFor(Event)) where?: Where,
  ): Promise<Count> {
    return await this.roomRepo.events(id).patch(event, where);
  }

  @del('/room/{id}/events', {
    responses: {
      '200': {
        description: 'Room.Event DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Event)) where?: Where,
  ): Promise<Count> {
    return await this.roomRepo.events(id).delete(where);
  }
}
