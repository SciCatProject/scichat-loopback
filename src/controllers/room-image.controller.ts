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

  @post('/rooms/{id}/images', {
    responses: {
      '200': {
        description: 'Room.Image model instance',
        content: {'application/json': {schema: {'x-ts-type': Image}}},
      },
    },
  })
  async create(
    @param.path.string('id') id: string,
    @requestBody() image: Image,
  ): Promise<Image> {
    return await this.roomRepo.images(id).create(image);
  }

  @get('/rooms/{id}/images', {
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
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter,
  ): Promise<Image[]> {
    return await this.roomRepo
      .images(id)
      .find(filter, {strictObjectIDCoercion: true});
  }

  @patch('/rooms/{id}/images', {
    responses: {
      '200': {
        description: 'Room.Image PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody() image: Partial<Image>,
    @param.query.object('where', getWhereSchemaFor(Image)) where?: Where,
  ): Promise<Count> {
    return await this.roomRepo.images(id).patch(image, where);
  }

  @del('/rooms/{id}/images', {
    responses: {
      '200': {
        description: 'Room.Image DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Image)) where?: Where,
  ): Promise<Count> {
    return await this.roomRepo.images(id).delete(where);
  }
}
