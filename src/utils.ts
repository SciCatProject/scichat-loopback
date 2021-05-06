import { inject } from "@loopback/core";
import { repository } from "@loopback/repository";
import { SynapseTokenRepository } from "./repositories";
import { SynapseService } from "./services";

export class Utils {
  username = process.env.SYNAPSE_BOT_NAME ?? "";
  password = process.env.SYNAPSE_BOT_PASSWORD ?? "";
  serverName = process.env.SYNAPSE_SERVER_NAME ?? "ess";
  userId = `@${this.username}:${this.serverName}`;

  constructor(
    @repository(SynapseTokenRepository)
    public synapseTokenRepository: SynapseTokenRepository,
    @inject("services.Synapse") protected synapseService: SynapseService,
  ) {}

  async createRoom(
    name: string,
    invites: string[] | undefined,
  ): Promise<{ room_alias: string; room_id: string }> {
    const synapseToken = await this.synapseTokenRepository.findOne({
      where: { user_id: this.userId },
    });
    const accessToken = synapseToken?.access_token;
    const formattedInvites = invites
      ? invites.map((user) =>
          user.startsWith("@") && user.indexOf(":") > 0
            ? user
            : `@${user}:${this.serverName}`,
        )
      : [];
    console.log("Creating new room", { name, invites });
    return await this.synapseService.createRoom(
      name,
      formattedInvites,
      accessToken,
    );
  }

  async renewAccessToken() {
    try {
      console.log("Requesting new Synapse token");
      await this.synapseTokenRepository.deleteAll();
      const synapseToken = await this.synapseService.login(
        this.username,
        this.password,
      );
      await this.synapseTokenRepository.create(synapseToken);
      console.log("Request for new Synapse token successful");
    } catch (err) {
      console.error(err);
    }
  }
}
