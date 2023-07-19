import { inject } from "@loopback/core";
import {
  api,
  HttpErrors,
  post,
  requestBody,
  SchemaObject,
} from "@loopback/rest";
import { TokenServiceBindings } from "../keys";
import { SynapseService } from "../services";
import { TokenServiceManager } from "../services/token.service";

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

export type Credentials = {
  username: string;
  password: string;
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
  public synapseToken = undefined as string | undefined;

  constructor(
    @inject(TokenServiceBindings.TOKEN_MANAGER)
    private tokenServiceManager: TokenServiceManager,
    @inject("services.Synapse") protected synapseService: SynapseService,
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
  ): Promise<{ token: string | undefined }> {
    try {
      const synapseToken = this.tokenServiceManager.getToken();

      if (!synapseToken) {
        const newSynapseToken = await this.synapseService.login(
          credentials.username,
          credentials.password,
        );
        this.tokenServiceManager.setToken(newSynapseToken.access_token);

        return { token: newSynapseToken.access_token };
      }

      return { token: synapseToken };
    } catch (error) {
      if (error.statusCode === 403) {
        throw new HttpErrors.Unauthorized(
          `Invalid username or password: ${error}`,
        );
      }
      if (error.statusCode === 429) {
        throw new Error(
          `Rate Limit Exceeded, retry after ${
            Number(JSON.parse(error.message).retry_after_ms) / 1000
          } seconds`,
        );
      }
      throw new Error(error);
    }
  }
}
