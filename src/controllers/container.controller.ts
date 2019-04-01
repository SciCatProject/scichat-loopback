import {del, get, param, post, requestBody} from '@loopback/rest';
import {serviceProxy} from '@loopback/service-proxy';

import {IStorageService} from '../interfaces/storage.interface';
import {Container} from '../models/container.model';

export class ContainerController {
  @serviceProxy('Storage')
  private storageService: IStorageService;

  constructor() {}

  @post('/containers', {
    responses: {
      '200': {
        description: 'Container model instance',
        content: {'application/json': {schema: {'x-ts-type': Container}}},
      },
    },
  })
  async createContainer(
    @requestBody() container: Container,
  ): Promise<Container> {
    return await this.storageService.createContainer(container);
  }

  @get('/containers', {
    responses: {
      '200': {
        description: 'Array of Container model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Container}},
          },
        },
      },
    },
  })
  async getContainers(): Promise<Container[]> {
    return await this.storageService.getContainers();
  }

  @get('/containers/{container}', {
    responses: {
      '200': {
        description: 'Container model instance',
        content: {'application/json': {schema: {'x-ts-type': Container}}},
      },
    },
  })
  async getContainer(
    @param.path.string('container') container: string,
  ): Promise<Container> {
    return await this.storageService.getContainer(container);
  }

  @del('/containers/{container}', {
    responses: {
      '204': {
        description: 'Container DELETE success',
      },
    },
  })
  async destroyContainer(
    @param.path.string('container') container: string,
  ): Promise<Object> {
    return await this.storageService.destroyContainer(container);
  }
}
