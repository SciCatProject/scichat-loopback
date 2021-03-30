import { Model, model, property } from "@loopback/repository";
import { SynapseRooms } from ".";

@model()
export class SynapseSyncResponse extends Model {
  @property({
    type: "object",
  })
  account_data?: object;

  @property({
    type: "object",
  })
  to_device?: object;

  @property({
    type: "object",
  })
  device_lists?: object;

  @property({
    type: "object",
  })
  presence?: object;

  @property({
    type: "object",
  })
  rooms?: SynapseRooms;

  @property({
    type: "object",
  })
  groups?: object;

  @property({
    type: "object",
  })
  device_one_time_keys_count?: object;

  @property({
    type: "string",
  })
  next_batch?: string;

  constructor(data?: Partial<SynapseSyncResponse>) {
    super(data);
  }
}

export interface SynapseSyncResponseRelations {
  // describe navigational properties here
}

export type SynapseSyncResponseWithRelations = SynapseSyncResponse &
  SynapseSyncResponseRelations;
