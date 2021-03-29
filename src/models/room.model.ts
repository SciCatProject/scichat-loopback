import { Model, model } from "@loopback/repository";

@model()
export class Room extends Model {
  constructor(data?: Partial<Room>) {
    super(data);
  }
}

export interface RoomRelations {
  // describe navigational properties here
}

export type RoomWithRelations = Room & RoomRelations;
