import {Entity, hasMany, model, property} from '@loopback/repository';
import {Event} from './event.model';

@model()
export class Room extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
  })
  roomId?: string;

  @property({
    type: 'string',
  })
  topic?: string;

  @property({
    type: 'string',
  })
  canonicalAlias?: string;

  @hasMany(() => Event)
  events?: Event[];

  constructor(data?: Partial<Room>) {
    super(data);
  }
}
