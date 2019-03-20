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
import {Message} from '../models';
import {MessageRepository} from '../repositories';

export class MessageController {
  constructor(
    @repository(MessageRepository)
    public messageRepository : MessageRepository,
  ) {}

  @post('/messages', {
    responses: {
      '200': {
        description: 'Message model instance',
        content: {'application/json': {schema: {'x-ts-type': Message}}},
      },
    },
  })
  async create(@requestBody() message: Message): Promise<Message> {
    return await this.messageRepository.create(message);
  }

  @get('/messages/count', {
    responses: {
      '200': {
        description: 'Message model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Message)) where?: Where,
  ): Promise<Count> {
    return await this.messageRepository.count(where);
  }

  @get('/messages', {
    responses: {
      '200': {
        description: 'Array of Message model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Message}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Message)) filter?: Filter,
  ): Promise<Message[]> {
    return await this.messageRepository.find(filter);
  }

  @patch('/messages', {
    responses: {
      '200': {
        description: 'Message PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() message: Message,
    @param.query.object('where', getWhereSchemaFor(Message)) where?: Where,
  ): Promise<Count> {
    return await this.messageRepository.updateAll(message, where);
  }

  @get('/messages/{id}', {
    responses: {
      '200': {
        description: 'Message model instance',
        content: {'application/json': {schema: {'x-ts-type': Message}}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Message> {
    return await this.messageRepository.findById(id);
  }

  @patch('/messages/{id}', {
    responses: {
      '204': {
        description: 'Message PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() message: Message,
  ): Promise<void> {
    await this.messageRepository.updateById(id, message);
  }

  @put('/messages/{id}', {
    responses: {
      '204': {
        description: 'Message PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() message: Message,
  ): Promise<void> {
    await this.messageRepository.replaceById(id, message);
  }

  @del('/messages/{id}', {
    responses: {
      '204': {
        description: 'Message DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.messageRepository.deleteById(id);
  }
}
