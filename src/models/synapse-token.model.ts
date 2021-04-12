import { Entity, model, property } from "@loopback/repository";

@model()
export class SynapseToken extends Entity {
  @property({
    type: "string",
    required: true,
  })
  user_id: string;

  @property({
    type: "string",
    id: true,
    generated: true,
  })
  id?: string;

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
  })
  device_id: string;

  @property({
    type: "object",
  })
  well_known: object;

  constructor(data?: Partial<SynapseToken>) {
    super(data);
  }
}

export interface SynapseTokenRelations {
  // describe navigational properties here
}

export type SynapseTokenWithRelations = SynapseToken & SynapseTokenRelations;
