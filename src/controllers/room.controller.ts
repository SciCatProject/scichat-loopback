import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Room} from '../models';
import {RoomRepository} from '../repositories';

export class RoomController {
  constructor(
    @repository(RoomRepository)
    public roomRepository : RoomRepository,
  ) {}

  @post('/rooms', {
    responses: {
      '200': {
        description: 'Room model instance',
        content: {'application/json': {schema: {'x-ts-type': Room}}},
      },
    },
  })
  async create(@requestBody() room: Room): Promise<Room> {
    return await this.roomRepository.create(room);
  }

  @get('/rooms/count', {
    responses: {
      '200': {
        description: 'Room model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Room)) where?: Where,
  ): Promise<Count> {
    return await this.roomRepository.count(where);
  }

  @get('/rooms', {
    responses: {
      '200': {
        description: 'Array of Room model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Room}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Room)) filter?: Filter,
  ): Promise<Room[]> {
    return await this.roomRepository.find(filter);
  }

  @patch('/rooms', {
    responses: {
      '200': {
        description: 'Room PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() room: Room,
    @param.query.object('where', getWhereSchemaFor(Room)) where?: Where,
  ): Promise<Count> {
    return await this.roomRepository.updateAll(room, where);
  }

  @get('/rooms/{id}', {
    responses: {
      '200': {
        description: 'Room model instance',
        content: {'application/json': {schema: {'x-ts-type': Room}}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Room> {
    return await this.roomRepository.findById(id);
  }

  @patch('/rooms/{id}', {
    responses: {
      '204': {
        description: 'Room PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() room: Room,
  ): Promise<void> {
    await this.roomRepository.updateById(id, room);
  }

  @put('/rooms/{id}', {
    responses: {
      '204': {
        description: 'Room PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() room: Room,
  ): Promise<void> {
    await this.roomRepository.replaceById(id, room);
  }

  @del('/rooms/{id}', {
    responses: {
      '204': {
        description: 'Room DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.roomRepository.deleteById(id);
  }
}
