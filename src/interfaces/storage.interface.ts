import {Response, Request} from '@loopback/rest';
import {Container} from '../models/container.model';
import {File} from '../models/file.model';
import {Stream} from 'stream';

export interface IStorageService {
  getContainers(): Promise<Container[]>;

  getContainer(container: string): Promise<Container>;

  createContainer(container: Container): Promise<Container>;

  destroyContainer(container: string): Promise<Object>;

  getFiles(container: string, options: Object): Promise<File[]>;

  getFile(container: string, file: string): Promise<File>;

  removeFile(container: string, file: string): Promise<Object>;

  upload(
    container: string,
    req: Request,
    res: Response,
    options: Object,
  ): Promise<Object>;

  download(
    container: string,
    file: string,
    req: Object,
    res: Object,
  ): Promise<Object>;

  uploadStream(container: string, file: string, options: Object): Stream;

  downloadStream(container: string, file: string, options: Object): Stream;
}
