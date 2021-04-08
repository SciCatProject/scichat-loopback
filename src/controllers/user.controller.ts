import { authenticate, TokenService } from "@loopback/authentication";
import { inject } from "@loopback/core";
import { model, property, repository } from "@loopback/repository";
import {
  api,
  get,
  getModelSchemaRef,
  post,
  requestBody,
  SchemaObject,
} from "@loopback/rest";
import { SecurityBindings, securityId, UserProfile } from "@loopback/security";
import { genSalt, hash } from "bcryptjs";
import _ from "lodash";
import { TokenServiceBindings, UserServiceBindings } from "../keys";
import { User } from "../models";
import { UserRepository } from "../repositories";
import { Credentials, SciChatUserService } from "../services";

@model()
export class NewUserRequest extends User {
  @property({
    type: "string",
    required: true,
  })
  password: string;
}

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

  @authenticate("jwt")
  @get("/Users/whoAmI", {
    responses: {
      "200": {
        description: "Return current user",
        content: {
          "application/json": {
            schema: {
              type: "string",
            },
          },
        },
      },
    },
  })
  async whoAmI(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<string> {
    return currentUserProfile[securityId];
  }

  @post("/Users", {
    responses: {
      "200": {
        description: "User",
        content: {
          "application/json": {
            schema: {
              "x-ts-type": User,
            },
          },
        },
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        "application/json": {
          schema: getModelSchemaRef(NewUserRequest, { title: "NewUser" }),
        },
      },
    })
    newUserRequest: NewUserRequest,
  ): Promise<User> {
    const password = await hash(newUserRequest.password, await genSalt());
    const savedUser = await this.userRepository.create(
      _.omit(newUserRequest, "password"),
    );

    await this.userRepository
      .userCredentials(savedUser.id)
      .create({ password });

    return savedUser;
  }
}
