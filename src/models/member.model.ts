import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Room} from './room.model';

@model()
export class Member extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

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

  @belongsTo(() => Room)
  roomId: string;

  constructor(data?: Partial<Member>) {
    super(data);
  }
}
