import {Entity, model, property} from '@loopback/repository';

@model()
export class Event extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

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

  @property({
    type: 'number',
  })
  roomId: number;

  constructor(data?: Partial<Event>) {
    super(data);
  }
}
