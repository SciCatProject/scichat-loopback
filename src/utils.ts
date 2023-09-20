import { inject } from "@loopback/core";
import { TokenServiceBindings } from "./keys";
import { SynapseService } from "./services";
import { TokenServiceManager } from "./services/token.service";

export class Utils {
  username = process.env.SYNAPSE_BOT_NAME ?? "";
  password = process.env.SYNAPSE_BOT_PASSWORD ?? "";
  serverName = process.env.SYNAPSE_SERVER_NAME ?? "ess";
  userId = `@${this.username}:${this.serverName}`;
  defaultPassword = process.env.DEFAULT_PASSWORD ?? "";

  constructor(
    @inject(TokenServiceBindings.TOKEN_MANAGER)
    private tokenServiceManager: TokenServiceManager,
    @inject("services.Synapse") protected synapseService: SynapseService,
  ) {}

  async renewAccessToken() {
    try {
      console.log("Requesting new Synapse token");
      const synapseToken = await this.synapseService.login(
        this.username,
        this.password,
      );
      this.tokenServiceManager.setToken(synapseToken.access_token);
      console.log("Request for new Synapse token successful");
    } catch (err) {
      console.error(err);
    }
  }
}
