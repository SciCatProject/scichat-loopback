import { Model, model, property } from "@loopback/repository";

@model()
export class SynapseCreateRoomResponse extends Model {
  @property({
    type: "string",
  })
  room_alias?: string;

  @property({
    type: "string",
  })
  room_id?: string;

  constructor(data?: Partial<SynapseCreateRoomResponse>) {
    super(data);
  }
}

export interface SynapseCreateRoomResponseRelations {
  // describe navigational properties here
}

export type SynapseCreateRoomResponseWithRelations = SynapseCreateRoomResponse &
  SynapseCreateRoomResponseRelations;
