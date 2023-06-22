import { inject } from "@loopback/core";
import { repository } from "@loopback/repository";
import { Member } from ".";
import { SynapseTokenRepository } from "./repositories";
import { SynapseService } from "./services";

export class Utils {
  username = process.env.SYNAPSE_BOT_NAME ?? "";
  password = process.env.SYNAPSE_BOT_PASSWORD ?? "";
  serverName = process.env.SYNAPSE_SERVER_NAME ?? "ess";
  userId = `@${this.username}:${this.serverName}`;
  defaultPassword = process.env.DEFAULT_PASSWORD ?? "";

  constructor(
    @repository(SynapseTokenRepository)
    public synapseTokenRepository: SynapseTokenRepository,
    @inject("services.Synapse") protected synapseService: SynapseService,
  ) {}

  async membersToCreate(members: Member[]): Promise<Member[]> {
    const synapseToken = await this.synapseTokenRepository.findOne({
      where: { user_id: this.userId },
    });
    const accessToken = synapseToken?.access_token;
    const queriedMembers = await Promise.all(
      members.map(async (member) => {
        const username =
          member.firstName.toLowerCase().replace(/\s/g, "") +
          member.lastName.toLowerCase().replace(/\s/g, "");
        const userId = `@${username}:${this.serverName}`;
        try {
          await this.synapseService.queryUser(userId, accessToken);
          console.log(`User ${username} already exists`);
          return null;
        } catch (err) {
          const errMessage = JSON.parse((err as Error).message);
          if (errMessage.errcode && errMessage.errcode === "M_NOT_FOUND") {
            return member;
          } else {
            console.error(err);
            return null;
          }
        }
      }),
    );
    return queriedMembers.filter(notEmpty);
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

function notEmpty<T>(value: T | null | undefined): value is T {
  if (value === null || value === undefined) {
    return false;
  }
  return true;
}
