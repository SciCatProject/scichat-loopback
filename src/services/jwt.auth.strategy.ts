import { AuthenticationStrategy, TokenService } from "@loopback/authentication";
import { inject } from "@loopback/core";
import { HttpErrors, Request } from "@loopback/rest";
import { TokenServiceBindings } from "../keys";

export class JWTAuthenticationStrategy implements AuthenticationStrategy {
  name = "jwt";

  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public tokenService: TokenService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async authenticate(request: Request): Promise<any> {
    const token: string = this.extractCredentials(request);

    // TODO: write some token validation logic here and return boolean instead of UserProfile
    // also to replace above Promise<any> with correct one

    return token.length > 0;
  }

  extractCredentials(request: Request): string {
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized(`Authorization header not found.`);
    }

    // for example : Bearer xxx.yyy.zzz
    const authHeaderValue = request.headers.authorization;

    if (!authHeaderValue.startsWith("Bearer")) {
      throw new HttpErrors.Unauthorized(
        `Authorization header is not of type 'Bearer'.`,
      );
    }

    //split the string into 2 parts : 'Bearer ' and the `xxx.yyy.zzz`
    const parts = authHeaderValue.split(" ");
    if (parts.length !== 2)
      throw new HttpErrors.Unauthorized(
        `Authorization header value has too many parts. It must follow the pattern: 'Bearer xx.yy.zz' where xx.yy.zz is a valid JWT token.`,
      );
    const token = parts[1];

    return token;
  }
}
