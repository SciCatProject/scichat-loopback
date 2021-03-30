/* eslint-disable @typescript-eslint/camelcase */
import { inject } from "@loopback/context";
import {
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
} from "@loopback/openapi-v3";
import { Logbook, SynapseCreateRoomResponse } from "../models";
import { Synapse } from "../services";

export interface CreateLogbookDetails {
  name: string;
  invites?: string[];
}

export class LogbookController {
  constructor(@inject("services.Synapse") protected synapseService: Synapse) {}

  private username = "";
  private password = "";

  @get("/Logbooks", {
    parameters: [
      {
        name: "filter",
        schema: { title: "Filter", type: "string" },
        in: "query",
      },
    ],
    responses: {
      "200": {
        description: "Array of Logbook model instances",
        content: {
          "application/json": {
            schema: [getModelSchemaRef(Logbook)],
          },
        },
      },
    },
  })
  async findAll(): Promise<Logbook[]> {
    const { access_token: accessToken } = await this.synapseService.login(
      this.username,
      this.password,
    );
    const filter = JSON.stringify({
      account_data: { not_types: ["m.*", "im.*"] },
      presence: { not_types: ["*"] },
      room: {
        state: { types: ["m.room.name"] },
        timeline: {
          limit: 1000000,
          types: ["m.room.message"],
        },
      },
    });
    const { rooms } = await this.synapseService.fetchAllRoomsMessages(
      filter,
      accessToken,
    );
    return Object.keys(rooms.join)
      .map(
        (roomId) =>
          new Logbook({
            roomId,
            name: rooms.join[roomId].state.events
              .map((event) => event.content["name"])
              .pop(),
            messages: rooms.join[roomId].timeline.events,
          }),
      )
      .filter((room) => room.roomId && room.name && room.messages);
  }

  @post("/Logbooks", {
    responses: {
      "200": {
        description: "Create Room Response",
        content: {
          "application/json": {
            schema: getModelSchemaRef(SynapseCreateRoomResponse),
          },
        },
      },
    },
  })
  async create(
    @requestBody() details: CreateLogbookDetails,
  ): Promise<SynapseCreateRoomResponse> {
    const { access_token: accessToken } = await this.synapseService.login(
      this.username,
      this.password,
    );
    const { name } = details;
    return this.synapseService.createRoom(name, accessToken);
  }

  @get("/Logbooks/{name}", {
    parameters: [
      {
        name: "name",
        schema: { title: "Logbook Name", type: "string" },
        in: "query",
      },
    ],
    responses: {
      "200": {
        description: "Logbook model instance",
        content: {
          "application/json": {
            schema: getModelSchemaRef(Logbook),
          },
        },
      },
    },
  })
  async findByName(@param.path.string("name") name: string): Promise<Logbook> {
    const { access_token: accessToken } = await this.synapseService.login(
      this.username,
      this.password,
    );
    const roomAlias = encodeURIComponent(`#${name}:ess`);
    const { room_id: roomId } = await this.synapseService.fetchRoomIdByName(
      roomAlias,
    );
    const filter = JSON.stringify({
      account_data: { not_types: ["m.*", "im.*"] },
      presence: { not_types: ["*"] },
      room: {
        rooms: [roomId],
        state: { types: ["m.room.name"] },
        timeline: {
          limit: 1000000,
          types: ["m.room.message"],
        },
      },
    });
    const { rooms } = await this.synapseService.fetchRoomMessages(
      filter,
      accessToken,
    );
    const messages = rooms.join[roomId].timeline.events;
    return new Logbook({ roomId, name, messages });
  }
}
