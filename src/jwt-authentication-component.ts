import { registerAuthenticationStrategy } from "@loopback/authentication";
import {
  Application,
  Binding,
  Component,
  CoreBindings,
  createBindingFromClass,
  inject,
} from "@loopback/core";
import {
  TokenServiceBindings,
  TokenServiceConstants,
  UserServiceBindings,
} from ".";
import { UserCredentialsRepository, UserRepository } from "./repositories";
import {
  JWTAuthenticationStrategy,
  JWTService,
  SciChatUserService,
  SecuritySpecEnhancer,
} from "./services";

export class JWTAuthenticationComponent implements Component {
  bindings: Binding[] = [
    // token bindings
    Binding.bind(TokenServiceBindings.TOKEN_SECRET).to(
      TokenServiceConstants.TOKEN_SECRET_VALUE,
    ),
    Binding.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE,
    ),
    Binding.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService),

    // user bindings
    Binding.bind(UserServiceBindings.USER_SERVICE).toClass(SciChatUserService),
    Binding.bind(UserServiceBindings.USER_REPOSITORY).toClass(UserRepository),
    Binding.bind(UserServiceBindings.USER_CREDENTIALS_REPOSITORY).toClass(
      UserCredentialsRepository,
    ),
    createBindingFromClass(SecuritySpecEnhancer),
  ];
  constructor(@inject(CoreBindings.APPLICATION_INSTANCE) app: Application) {
    registerAuthenticationStrategy(app, JWTAuthenticationStrategy);
  }
}
