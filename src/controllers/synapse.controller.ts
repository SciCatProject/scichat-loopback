import { inject } from "@loopback/context";
import { post, requestBody } from "@loopback/openapi-v3";
import { Synapse } from "../services";

export class SynapseController {
  constructor(@inject("services.Synapse") protected synapseService: Synapse) {}

  @post("/login")
  async login(
    @requestBody() username: string,
    @requestBody() password: string,
  ): Promise<object> {
    return this.synapseService.login(username, password);
  }
}
