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

  @post('/rooms/{id}/members', {
    responses: {
      '200': {
        description: 'Room.Member model instance',
        content: {'application/json': {schema: {'x-ts-type': Member}}},
      },
    },
  })
  async create(
    @param.path.string('id') id: string,
    @requestBody() member: Member,
  ): Promise<Member> {
    return await this.roomRepo.members(id).create(member);
  }

  @get('/rooms/{id}/members', {
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
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter,
  ): Promise<Member[]> {
    return await this.roomRepo.members(id).find(filter);
  }

  @patch('/rooms/{id}/members', {
    responses: {
      '200': {
        description: 'Room.Member PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody() member: Partial<Member>,
    @param.query.object('where', getWhereSchemaFor(Member)) where?: Where,
  ): Promise<Count> {
    return await this.roomRepo.members(id).patch(member, where);
  }

  @del('/rooms/{id}/members', {
    responses: {
      '200': {
        description: 'Room.Member DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Member)) where?: Where,
  ): Promise<Count> {
    return await this.roomRepo.members(id).delete(where);
  }
}
