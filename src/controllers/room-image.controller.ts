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
import {Image} from '../models';
import {RoomRepository} from '../repositories';

export class RoomImageController {
  constructor(@repository(RoomRepository) protected roomRepo: RoomRepository) {}

  @post('/room/{id}/images', {
    responses: {
      '200': {
        description: 'Room.Image model instance',
        content: {'application/json': {schema: {'x-ts-type': Image}}},
      },
    },
  })
  async create(
    @param.path.number('id') id: number,
    @requestBody() image: Image,
  ): Promise<Image> {
    return await this.roomRepo.images(id).create(image);
  }

  @get('/room/{id}/images', {
    responses: {
      '200': {
        description: 'Array of Images belonging to Room',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Image}},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter,
  ): Promise<Image[]> {
    return await this.roomRepo.images(id).find(filter);
  }

  @patch('/room/{id}/images', {
    responses: {
      '200': {
        description: 'Room.Image PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody() image: Partial<Image>,
    @param.query.object('where', getWhereSchemaFor(Image)) where?: Where,
  ): Promise<Count> {
    return await this.roomRepo.images(id).patch(image, where);
  }

  @del('/room/{id}/images', {
    responses: {
      '200': {
        description: 'Room.Image DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Image)) where?: Where,
  ): Promise<Count> {
    return await this.roomRepo.images(id).delete(where);
  }
}
