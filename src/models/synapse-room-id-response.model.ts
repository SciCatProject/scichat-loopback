import { Model, model, property } from "@loopback/repository";

@model()
export class SynapseRoomIdResponse extends Model {
  @property({
    type: "string",
  })
  room_id?: string;

  @property({
    type: "array",
    itemType: "string",
  })
  servers?: string[];

  constructor(data?: Partial<SynapseRoomIdResponse>) {
    super(data);
  }
}

export interface SynapseRoomIdResponseRelations {
  // describe navigational properties here
}

export type SynapseRoomIdResponseWithRelations = SynapseRoomIdResponse &
  SynapseRoomIdResponseRelations;
