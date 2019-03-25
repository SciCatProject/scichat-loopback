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
import {Member} from '../models';
import {MemberRepository} from '../repositories';

export class MemberController {
  constructor(
    @repository(MemberRepository)
    public memberRepository: MemberRepository,
  ) {}

  @post('/members', {
    responses: {
      '200': {
        description: 'Member model instance',
        content: {'application/json': {schema: {'x-ts-type': Member}}},
      },
    },
  })
  async create(@requestBody() member: Member): Promise<Member> {
    return await this.memberRepository.create(member);
  }

  @get('/members/count', {
    responses: {
      '200': {
        description: 'Member model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Member)) where?: Where,
  ): Promise<Count> {
    return await this.memberRepository.count(where);
  }

  @get('/members', {
    responses: {
      '200': {
        description: 'Array of Member model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Member}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Member)) filter?: Filter,
  ): Promise<Member[]> {
    return await this.memberRepository.find(filter);
  }

  @patch('/members', {
    responses: {
      '200': {
        description: 'Member PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() member: Member,
    @param.query.object('where', getWhereSchemaFor(Member)) where?: Where,
  ): Promise<Count> {
    return await this.memberRepository.updateAll(member, where);
  }

  @get('/members/{id}', {
    responses: {
      '200': {
        description: 'Member model instance',
        content: {'application/json': {schema: {'x-ts-type': Member}}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Member> {
    return await this.memberRepository.findById(id);
  }

  @patch('/members/{id}', {
    responses: {
      '204': {
        description: 'Member PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() member: Member,
  ): Promise<void> {
    await this.memberRepository.updateById(id, member);
  }

  @put('/members/{id}', {
    responses: {
      '204': {
        description: 'Member PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() member: Member,
  ): Promise<void> {
    await this.memberRepository.replaceById(id, member);
  }

  @del('/members/{id}', {
    responses: {
      '204': {
        description: 'Member DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.memberRepository.deleteById(id);
  }
}
