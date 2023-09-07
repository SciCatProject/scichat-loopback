import { BindingKey } from "@loopback/core";
import { TokenServiceManager } from "./services/token.service";

export namespace UtilsBindings {
  export const UTILS = "utils";
}

export namespace TokenServiceBindings {
  export const TOKEN_MANAGER =
    BindingKey.create<TokenServiceManager>("token.manager");
  export const TOKEN_KEY = "token.manager.key";
  export const TOKEN_STATUS = "token.status.key";
}
