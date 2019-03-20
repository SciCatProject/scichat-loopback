import {Entity, hasMany, model, property} from '@loopback/repository';
import {Event} from './event.model';
import {Image} from './image.model';
import {Member} from './member.model';
import {Message} from './message.model';

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
    default: false,
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
    type: 'boolean',
    default: false,
  })
  federate?: boolean;

  @property({
    type: 'string',
  })
  roomId?: string;

  @property({
    type: 'boolean',
    default: false,
  })
  guestCanJoin?: boolean;

  @property.array(String)
  aliases?: string[];

  @hasMany(() => Event)
  events?: Event[];

  @hasMany(() => Member)
  members?: Member[];

  @hasMany(() => Message)
  messages?: Message[];

  @hasMany(() => Image)
  images?: Image[];

  constructor(data?: Partial<Room>) {
    super(data);
  }
}
