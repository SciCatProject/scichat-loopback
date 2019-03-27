import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Room} from './room.model';

@model()
export class Image extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'object',
  })
  content?: object;

  @property({
    type: 'string',
  })
  eventId?: string;

  @property({
    type: 'number',
  })
  timestamp?: number;

  @property({
    type: 'string',
  })
  sender?: string;

  @property({
    type: 'string',
    default: 'm.room.message',
  })
  type?: string;

  @property({
    type: 'object',
  })
  unsigned?: object;

  @property({
    type: 'string',
  })
  synapseRoomId?: string;

  @belongsTo(() => Room)
  roomId: string;

  constructor(data?: Partial<Image>) {
    super(data);
  }
}
