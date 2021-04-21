import { TokenService } from "@loopback/authentication";
import { inject } from "@loopback/core";
import { repository } from "@loopback/repository";
import { api, post, requestBody, SchemaObject } from "@loopback/rest";
import { SecurityBindings, UserProfile } from "@loopback/security";
import { TokenServiceBindings, UserServiceBindings } from "../keys";
import { UserRepository } from "../repositories";
import { Credentials, SciChatUserService } from "../services";

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
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE) public jwtService: TokenService,
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
    const user = await this.userService.verifyCredentials(credentials);
    const userProfile = this.userService.convertToUserProfile(user);
    const token = await this.jwtService.generateToken(userProfile);
    return { token };
  }
}
