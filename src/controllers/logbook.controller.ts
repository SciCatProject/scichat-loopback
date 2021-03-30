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
    const accessToken = this.synapseService.login("username", "password");
    const roomInfo = await this.synapseService.fetchRoomIdByName(name);
    return this.synapseService.fetchRoomMessages(
      roomInfo["room_id"],
      accessToken,
    );
  }
}
