import { inject } from "@loopback/context";
import { get, post, requestBody } from "@loopback/openapi-v3";
import { Synapse } from "../services";

export interface Credentials {
  username: string;
  password: string;
}
export class SynapseController {
  constructor(@inject("services.Synapse") protected synapseService: Synapse) {}

  @post("/login")
  async login(@requestBody() credentials: Credentials): Promise<object> {
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
}
