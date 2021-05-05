import { TokenService, UserService } from "@loopback/authentication";
import { BindingKey } from "@loopback/core";
import { User } from "./models";
import { Credentials } from "./services/user.service";

export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = process.env.JWT_SECRET ?? "myjwts3cr3t";
  export const TOKEN_EXPIRES_IN_VALUE = process.env.JWT_EXPIRES_IN ?? "21600";
}

export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>(
    "authentication.jwt.secret",
  );
  export const TOKEN_EXPIRES_IN = BindingKey.create<string>(
    "authentication.jwt.expires.in.seconds",
  );
  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    "services.authentication.jwt.tokenservice",
  );
}

export namespace UserServiceBindings {
  export const USER_SERVICE = BindingKey.create<UserService<User, Credentials>>(
    "services.user.service",
  );
  export const DATASOURCE_NAME = "jwtdb";
  export const USER_REPOSITORY = "repositories.UserRepository";
  export const USER_CREDENTIALS_REPOSITORY =
    "repositories.UserCredentialsRepository";
}

export namespace UtilsBindings {
  export const UTILS = "utils";
}
