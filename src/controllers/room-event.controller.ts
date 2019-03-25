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

  @post('/rooms/{id}/events', {
    responses: {
      '200': {
        description: 'Room.Event model instance',
        content: {'application/json': {schema: {'x-ts-type': Event}}},
      },
    },
  })
  async create(
    @param.path.string('id') id: string,
    @requestBody() event: Event,
  ): Promise<Event> {
    return await this.roomRepo.events(id).create(event);
  }

  @get('/rooms/{id}/events', {
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
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter,
  ): Promise<Event[]> {
    return await this.roomRepo
      .events(id)
      .find(filter, {strictObjectIDCoercion: true});
  }

  @patch('/rooms/{id}/events', {
    responses: {
      '200': {
        description: 'Room.Event PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody() event: Partial<Event>,
    @param.query.object('where', getWhereSchemaFor(Event)) where?: Where,
  ): Promise<Count> {
    return await this.roomRepo.events(id).patch(event, where);
  }

  @del('/rooms/{id}/events', {
    responses: {
      '200': {
        description: 'Room.Event DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Event)) where?: Where,
  ): Promise<Count> {
    return await this.roomRepo.events(id).delete(where);
  }
}
