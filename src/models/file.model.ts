import {Entity, model, property} from '@loopback/repository';

@model()
export class File extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  type?: string;

  @property({
    type: 'string',
  })
  url?: string;

  constructor(data?: Partial<File>) {
    super(data);
  }
}
