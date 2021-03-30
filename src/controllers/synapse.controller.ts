import { inject } from "@loopback/context";
import {
  get,
  getModelSchemaRef,
  post,
  requestBody,
} from "@loopback/openapi-v3";
import { SynapseLoginResponse, SynapseRoomIdResponse } from "../models";
import { Synapse } from "../services";

export interface Credentials {
  username: string;
  password: string;
}
export class SynapseController {
  constructor(@inject("services.Synapse") protected synapseService: Synapse) {}

  @post("/login", {
    responses: {
      "200": {
        description: "Synapse Login Response",
        content: {
          "application/json": {
            schema: getModelSchemaRef(SynapseLoginResponse),
          },
        },
      },
    },
  })
  async login(
    @requestBody() credentials: Credentials,
  ): Promise<SynapseLoginResponse> {
    return this.synapseService.login(
      credentials.username,
      credentials.password,
    );
  }

  @get("/fetchPublicRooms", {
    parameters: [
      { name: "accessToken", schema: { type: "string" }, in: "query" },
    ],
    responses: {
      "200": {
        description: "public rooms",
        content: {
          "application/json": {
            schema: { type: "object" },
          },
        },
      },
    },
  })
  async fetchPublicRooms(accessToken: string): Promise<object> {
    return this.synapseService.fetchPublicRooms(accessToken);
  }

  @get("fetchRoomIdByName", {
    parameters: [
      { name: "name", schema: { title: "Name", type: "string" }, in: "query" },
    ],
    responses: {
      "200": {
        description: "Room ID",
        content: {
          "application/json": {
            schema: getModelSchemaRef(SynapseRoomIdResponse),
          },
        },
      },
    },
  })
  async fetchRoomIdByName(name: string): Promise<SynapseRoomIdResponse> {
    const roomAlias = encodeURIComponent(`#${name}:ess`);
    return this.synapseService.fetchRoomIdByName(roomAlias);
  }
}
