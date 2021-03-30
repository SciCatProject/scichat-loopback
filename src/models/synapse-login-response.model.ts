import { Model, model, property } from "@loopback/repository";

@model()
export class SynapseLoginResponse extends Model {
  @property({
    type: "string",
    required: true,
  })
  user_id: string;

  @property({
    type: "string",
    required: true,
  })
  access_token: string;

  @property({
    type: "string",
    required: true,
  })
  home_server: string;

  @property({
    type: "string",
    required: true,
  })
  device_id: string;

  @property({
    type: "object",
    required: true,
  })
  well_known: object;

  constructor(data?: Partial<SynapseLoginResponse>) {
    super(data);
  }
}

export interface SynapseLoginResponseRelations {
  // describe navigational properties here
}

export type SynapseLoginResponseWithRelations = SynapseLoginResponse &
  SynapseLoginResponseRelations;
