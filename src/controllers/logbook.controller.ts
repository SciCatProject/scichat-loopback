/* eslint-disable @typescript-eslint/camelcase */
import { inject } from "@loopback/context";
import { get, getModelSchemaRef, param } from "@loopback/openapi-v3";
import { Logbook } from "../models";
import { Synapse } from "../services";

export class LogbookController {
  constructor(@inject("services.Synapse") protected synapseService: Synapse) {}

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
  async findByName(@param.path.string("name") name: string): Promise<object> {
    const { access_token: accessToken } = await this.synapseService.login(
      "username",
      "password",
    );
    const roomAlias = encodeURIComponent(`#${name}:ess`);
    const { room_id: roomId } = await this.synapseService.fetchRoomIdByName(
      roomAlias,
    );
    const filter = encodeURIComponent(
      JSON.stringify({
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
      }),
    );
    const { rooms } = await this.synapseService.fetchRoomMessages(
      filter,
      accessToken,
    );
    const messages = rooms.join[roomId].timeline.events;
    return { roomId, name, messages };
  }
}
