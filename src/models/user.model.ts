import { Entity, model, property } from "@loopback/repository";

@model()
export class User extends Entity {
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
  username: string;

  @property({
    type: "string",
    required: true,
  })
  password: string;

  @property({
    type: "string",
  })
  email?: string;

  @property({
    type: "boolean",
  })
  emailVerified?: boolean;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
