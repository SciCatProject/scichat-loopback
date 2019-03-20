import {Entity, model, property} from '@loopback/repository';

@model()
export class Message extends Entity {
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

  @property({
    type: 'number',
  })
  roomId: number;

  constructor(data?: Partial<Message>) {
    super(data);
  }
}
