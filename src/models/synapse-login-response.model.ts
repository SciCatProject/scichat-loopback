import { Model, model, property } from "@loopback/repository";

@model()
export class SynapseLoginResponse extends Model {
  @property({
    type: "string",
  })
  user_id?: string;

  @property({
    type: "string",
  })
  access_token?: string;

  @property({
    type: "string",
  })
  home_server?: string;

  @property({
    type: "string",
  })
  device_id?: string;

  @property({
    type: "object",
  })
  well_known?: object;

  constructor(data?: Partial<SynapseLoginResponse>) {
    super(data);
  }
}

export interface SynapseLoginResponseRelations {
  // describe navigational properties here
}

export type SynapseLoginResponseWithRelations = SynapseLoginResponse &
  SynapseLoginResponseRelations;
