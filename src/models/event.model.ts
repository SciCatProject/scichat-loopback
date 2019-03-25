import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Room} from './room.model';

@model()
export class Event extends Entity {
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
  eventId?: string;

  @property({
    type: 'object',
  })
  unsigned?: object;

  @property({
    type: 'string',
  })
  stateKey?: string;

  @property({
    type: 'object',
  })
  content?: object;

  @property({
    type: 'string',
  })
  type?: string;

  @belongsTo(() => Room)
  roomId: string;

  constructor(data?: Partial<Event>) {
    super(data);
  }
}
