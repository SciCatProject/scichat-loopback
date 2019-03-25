import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Room} from './room.model';

@model()
export class Message extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

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
  })
  synapseEventId?: string;

  @property({
    type: 'object',
  })
  unsigned?: object;

  @property({
    type: 'object',
  })
  content?: object;

  @property({
    type: 'string',
    default: 'm.room.message',
  })
  type?: string;

  @belongsTo(() => Room)
  roomId: string;

  constructor(data?: Partial<Message>) {
    super(data);
  }
}
