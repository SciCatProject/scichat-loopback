import { TokenService } from "@loopback/authentication";
import { inject } from "@loopback/core";
import { repository } from "@loopback/repository";
import { api, post, requestBody, SchemaObject } from "@loopback/rest";
import { SecurityBindings, UserProfile } from "@loopback/security";
import { TokenServiceBindings, UserServiceBindings } from "../keys";
import { UserRepository } from "../repositories";
import { Credentials, SciChatUserService, SynapseService } from "../services";

const credentialsSchema: SchemaObject = {
  type: "object",
  required: ["username", "password"],
  properties: {
    username: {
      type: "string",
    },
    password: {
      type: "string",
    },
  },
};

export const credentialsRequestBody = {
  description: "The input of login function",
  required: true,
  content: {
    "application/json": { schema: credentialsSchema },
  },
};

@api({ basePath: "/scichatapi" })
export class UserController {
  private synapseToken: string;
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE) public jwtService: TokenService,
    @inject("services.Synapse") protected synapseService: SynapseService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: SciChatUserService,
    @inject(SecurityBindings.USER, { optional: true }) public user: UserProfile,
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {}

  @post("/Users/login", {
    responses: {
      "200": {
        description: "Token",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                token: {
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(credentialsRequestBody) credentials: Credentials,
  ): Promise<{ token: string }> {
    // TODO: remove below services and cleanup userService and userService related folders.
    // Since we plan to avoid getting Token from MongoDB, userService is probabbly not needed anymore.

    // const user = await this.userService.verifyCredentials(credentials);
    // const userProfile = this.userService.convertToUserProfile(user);
    // const token = await this.jwtService.generateToken(userProfile);

    try {
      if (this.synapseToken) {
        return { token: this.synapseToken };
      }
      const tokenSynapse = await this.synapseService.login(
        credentials.username,
        credentials.password,
      );
      this.synapseToken = tokenSynapse.access_token;
      return { token: this.synapseToken };
    } catch (error) {
      throw new Error(error);
    }
  }
}
