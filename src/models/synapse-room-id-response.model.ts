import { Model, model, property } from "@loopback/repository";

@model()
export class SynapseRoomIdResponse extends Model {
  @property({
    type: "string",
    required: true,
  })
  room_id: string;

  @property({
    type: "array",
    itemType: "string",
    required: true,
  })
  servers: string[];

  constructor(data?: Partial<SynapseRoomIdResponse>) {
    super(data);
  }
}

export interface SynapseRoomIdResponseRelations {
  // describe navigational properties here
}

export type SynapseRoomIdResponseWithRelations = SynapseRoomIdResponse &
  SynapseRoomIdResponseRelations;
