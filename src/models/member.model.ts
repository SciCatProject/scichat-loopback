import {Entity, model, property} from '@loopback/repository';

@model()
export class Member extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @property({
    type: 'object',
  })
  previousContent?: object;

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
    type: 'number',
  })
  age?: number;

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
  synapseRoomId?: string;

  @property({
    type: 'string',
  })
  userId?: string;

  @property({
    type: 'string',
  })
  replacesState?: string;

  @property({
    type: 'string',
  })
  type?: string;

  @property({
    type: 'number',
  })
  roomId: number;

  constructor(data?: Partial<Member>) {
    super(data);
  }
}
