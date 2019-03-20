import {Entity, model, property} from '@loopback/repository';

@model()
export class Image extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @property({
    type: 'object',
  })
  content?: object;

  @property({
    type: 'string',
  })
  synapseEventId?: string;

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

  @property({
    type: 'number',
  })
  roomId: number;

  constructor(data?: Partial<Image>) {
    super(data);
  }
}
