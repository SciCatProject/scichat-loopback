import { Model, model, property } from "@loopback/repository";
import { SynapseRooms } from ".";

@model()
export class SynapseSyncResponse extends Model {
  @property({
    type: "object",
    required: true,
  })
  account_data: object;

  @property({
    type: "object",
    required: true,
  })
  to_device: object;

  @property({
    type: "object",
    required: true,
  })
  device_lists: object;

  @property({
    type: "object",
    required: true,
  })
  presence: object;

  @property({
    type: "object",
    required: true,
  })
  rooms: SynapseRooms;

  @property({
    type: "object",
    required: true,
  })
  groups: object;

  @property({
    type: "object",
    required: true,
  })
  device_one_time_keys_count: object;

  @property({
    type: "string",
    required: true,
  })
  next_batch: string;

  constructor(data?: Partial<SynapseSyncResponse>) {
    super(data);
  }
}

export interface SynapseSyncResponseRelations {
  // describe navigational properties here
}

export type SynapseSyncResponseWithRelations = SynapseSyncResponse &
  SynapseSyncResponseRelations;
