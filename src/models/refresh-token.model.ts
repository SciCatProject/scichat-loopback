import { belongsTo, Entity, model, property } from "@loopback/repository";
import { User } from "./user.model";

@model({ settings: { strict: false } })
export class RefreshToken extends Entity {
  @property({
    type: "number",
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: "string",
    required: true,
  })
  refreshToken: string;

  @belongsTo(() => User)
  userId: string;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<RefreshToken>) {
    super(data);
  }
}

export interface RefreshTokenRelations {
  // describe navigational properties here
}

export type RefreshTokenWithRelations = RefreshToken & RefreshTokenRelations;
