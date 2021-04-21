import { Entity, hasOne, model, property } from "@loopback/repository";
import { UserCredentials } from "./user-credentials.model";

@model({ settings: { strict: false } })
export class User extends Entity {
  @property({
    type: "string",
    id: true,
    generated: false,
    defaultFn: "uuidv4",
  })
  id: string;

  @property({
    type: "string",
  })
  realm?: string;

  @property({
    type: "string",
    required: true,
    index: {
      unique: true,
    },
  })
  username: string;

  @property({
    type: "string",
  })
  email?: string;

  @property({
    type: "boolean",
  })
  emailVerified?: boolean;

  @property({
    type: "string",
  })
  verificationToken?: string;

  @hasOne(() => UserCredentials)
  userCredentials: UserCredentials;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
