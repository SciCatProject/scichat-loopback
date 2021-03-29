import { inject } from "@loopback/context";
import { param, post } from "@loopback/openapi-v3";
import { Synapse } from "../services";

export class SynapseController {
  constructor(@inject("services.Synapse") protected synapseService: Synapse) {}

  @post("/login")
  async login(
    @param.path.string("username") username: string,
    @param.path.password("password") password: string,
  ): Promise<object> {
    return this.synapseService.login(username, password);
  }
}
