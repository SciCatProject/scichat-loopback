import { Model, model, property } from "@loopback/repository";

@model()
export class Logbook extends Model {
  @property({
    type: "string",
  })
  name?: string;

  @property({
    type: "string",
  })
  roomId?: string;

  @property({
    type: "array",
    itemType: "object",
  })
  messages?: object[];

  constructor(data?: Partial<Logbook>) {
    super(data);
  }
}

export interface LogbookRelations {
  // describe navigational properties here
}

export type LogbookWithRelations = Logbook & LogbookRelations;
