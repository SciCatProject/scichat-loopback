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
import {Member} from '../models';
import {RoomRepository} from '../repositories';

export class RoomMemberController {
  constructor(@repository(RoomRepository) protected roomRepo: RoomRepository) {}

  @post('/room/{id}/members', {
    responses: {
      '200': {
        description: 'Room.Member model instance',
        content: {'application/json': {schema: {'x-ts-type': Member}}},
      },
    },
  })
  async create(
    @param.path.number('id') id: number,
    @requestBody() member: Member,
  ): Promise<Member> {
    return await this.roomRepo.members(id).create(member);
  }

  @get('/room/{id}/members', {
    responses: {
      '200': {
        description: 'Array of Members belonging to Room',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Member}},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter,
  ): Promise<Member[]> {
    return await this.roomRepo.members(id).find(filter);
  }

  @patch('/room/{id}/members', {
    responses: {
      '200': {
        description: 'Room.Member PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody() member: Partial<Member>,
    @param.query.object('where', getWhereSchemaFor(Member)) where?: Where,
  ): Promise<Count> {
    return await this.roomRepo.members(id).patch(member, where);
  }

  @del('/room/{id}/members', {
    responses: {
      '200': {
        description: 'Room.Member DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Member)) where?: Where,
  ): Promise<Count> {
    return await this.roomRepo.members(id).delete(where);
  }
}
