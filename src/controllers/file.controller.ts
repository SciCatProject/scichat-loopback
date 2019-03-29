import {get, param, post} from '@loopback/rest';
import {serviceProxy} from '@loopback/service-proxy';

import {IStorageService} from '../interfaces/storage.interface';
import {File} from '../models/file.model';

export class FileController {
  @serviceProxy('Storage')
  private storageService: IStorageService;

  constructor() {}

  @get('/containers/{container}/files', {
    responses: {
      '200': {
        description: 'Array of Files belonging to Container',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': File}},
          },
        },
      },
    },
  })
  async getFiles(
    @param.path.string('container') container: string,
    @param.query.object('options') options: Object,
  ): Promise<File[]> {
    return await this.storageService.getFiles(
      container,
      options,
      <Array>(err: Error, files: Array) => {
        if (err) {
          return Promise.resolve(err);
        }

        return Promise.resolve(files);
      },
    );
  }

  @get('/containers/{container}/files/{file}', {
    responses: {
      '200': {
        description: 'File model instance belonging to Container',
        content: {'application/json': {schema: {'x-ts-type': File}}},
      },
    },
  })
  async getFile(
    @param.path.string('container') container: string,
    @param.path.string('file') file: string,
  ): Promise<File> {
    return await this.storageService.getFile(
      container,
      file,
      <File>(err: Error, file: File) => {
        if (err) {
          return Promise.reject(err);
        }

        return Promise.resolve(file);
      },
    );
  }

  @post('/containers/{container}/upload', {
    responses: {
      '200': {
        description: 'Upload File to Container',
        content: {'application/json': {schema: {'x-ts-type': Object}}},
      },
    },
  })
  async upload(
    @param.path.string('container') container: string,
    @param.query.object('req') req: Object,
    @param.query.object('res') res: Object,
  ): Promise<Object> {
    return await this.storageService.upload(
      container,
      req,
      res,
      <Object>(err: Error, result: Object) => {
        if (err) {
          return Promise.reject(err);
        }

        return Promise.resolve(result);
      },
    );
  }

  @get('/containers/{container}/download/{file}', {
    responses: {
      '200': {
        description: 'Download File from Container',
        content: {'application/json': {schema: {'x-ts-type': Object}}},
      },
    },
  })
  async download(
    @param.path.string('container') container: string,
    @param.path.string('file') file: string,
    @param.query.object('req') req: string,
    @param.query.object('res') res: string,
  ): Promise<Object> {
    return await this.storageService.download(
      container,
      file,
      req,
      res,
      <Object>(err: Error, result: Object) => {
        if (err) {
          return Promise.reject(err);
        }

        return Promise.resolve(result);
      },
    );
  }
}
