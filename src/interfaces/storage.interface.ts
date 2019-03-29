import {Container} from '../models/container.model';
import {File} from '../models/file.model';

interface ICallback {
  <T>(error: Error, result?: T): void;
}

interface IReturnFunction<T> {
  (): T;
}

export interface IStorageService {
  getContainers(cb: ICallback): Promise<Container[]>;

  getContainer(container: string, cb: ICallback): Promise<Container>;

  createContainer(container: Container, cb: ICallback): Promise<Container>;

  destroyContainer(container: string, cb: ICallback): Promise<Object>;

  getFiles(container: string, options: Object, cb: ICallback): Promise<File[]>;

  getFile(container: string, file: string, cb: ICallback): Promise<File>;

  removeFile(container: string, file: string, cb: ICallback): Promise<Object>;

  upload(
    container: string,
    req: Object,
    res: Object,
    cb: ICallback,
  ): Promise<Object>;

  download(
    container: string,
    file: string,
    req: Object,
    res: Object,
    cb: ICallback,
  ): Promise<Object>;

  uploadStream(
    container: string,
    file: string,
    options: Object,
  ): IReturnFunction<Function>;

  downloadStream(
    container: string,
    file: string,
    options: Object,
  ): IReturnFunction<Function>;
}
