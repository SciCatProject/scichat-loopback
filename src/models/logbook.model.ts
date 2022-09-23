import { Model, model, property } from "@loopback/repository";

export interface Message {
  content: {
    body: string;
    info?: {
      thumbnail_url?: string;
    };
    msgtype: string;
    url?: string;
  };
  event_id: string;
  origin_server_ts: number;
  sender: string;
  type: string;
  unsigned: {
    age: number;
  };
}

@model()
export class Logbook extends Model {
  @property({
    type: "string",
    required: true,
  })
  name: string;

  @property({
    type: "string",
    required: true,
  })
  roomId: string;

  @property({
    type: "array",
    itemType: "object",
    required: true,
  })
  messages: Message[];

  constructor(data?: Partial<Logbook>) {
    super(data);
  }
}

export interface LogbookRelations {
  // describe navigational properties here
}

export type LogbookWithRelations = Logbook & LogbookRelations;
