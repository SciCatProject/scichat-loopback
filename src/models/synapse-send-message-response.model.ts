import {Model, model, property} from '@loopback/repository';

@model()
export class SynapseSendMessageResponse extends Model {
  @property({
    type: 'string',
    required: true,
  })
  event_id: string;


  constructor(data?: Partial<SynapseSendMessageResponse>) {
    super(data);
  }
}

export interface SynapseSendMessageResponseRelations {
  // describe navigational properties here
}

export type SynapseSendMessageResponseWithRelations = SynapseSendMessageResponse & SynapseSendMessageResponseRelations;
