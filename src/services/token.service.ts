import { Context } from "@loopback/context";
import { inject } from "@loopback/core";

export class TokenServiceManager {
  private static TOKEN_KEY = "token.manager.key";

  constructor(@inject.context() private context: Context) {}

  setToken(token: string): void {
    this.context.bind(TokenServiceManager.TOKEN_KEY).to(token);
  }

  getToken(): string | undefined {
    return this.context.getSync(TokenServiceManager.TOKEN_KEY);
  }
}
