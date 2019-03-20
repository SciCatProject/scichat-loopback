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
  canonicalAlias?: string;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'boolean',
  })
  worldReadable?: boolean;

  @property({
    type: 'string',
  })
  topic?: string;

  @property({
    type: 'number',
  })
  numberOfJoinedMembers?: number;

  @property({
    type: 'false',
  })
  federate?: boolean;

  @property({
    type: 'string',
  })
  roomId?: string;

  @property({
    type: 'false',
  })
  guestCanJoin?: boolean;

  @property({
    type: 'array',
  })
  aliases?: string[];

  @hasMany(() => Event)
  events?: Event[];

  constructor(data?: Partial<Room>) {
    super(data);
  }
}
