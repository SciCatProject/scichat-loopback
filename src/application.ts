import { AuthenticationComponent } from "@loopback/authentication";
import { BootMixin } from "@loopback/boot";
import { ApplicationConfig, BindingScope } from "@loopback/core";
import { RepositoryMixin } from "@loopback/repository";
import { RestApplication } from "@loopback/rest";
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from "@loopback/rest-explorer";
import { ServiceMixin } from "@loopback/service-proxy";
import path from "path";
import { UserController } from "./controllers/user.controller";
import { TokenServiceBindings, UtilsBindings } from "./keys";
import { MySequence } from "./sequence";
import { TokenServiceManager } from "./services/token.service";
import { Utils } from "./utils";

export { ApplicationConfig };

export class ScichatLoopbackApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static("/", path.join(__dirname, "../public"));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: "/scichatexplorer",
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ["controllers"],
        extensions: [".controller.js"],
        nested: true,
      },
    };
    // Mount authentication system
    this.component(AuthenticationComponent);

    this.bind(UtilsBindings.UTILS).toClass(Utils);

    this.bind(TokenServiceBindings.TOKEN_MANAGER)
      .toClass(TokenServiceManager)
      .inScope(BindingScope.SINGLETON);

    this.bind(TokenServiceBindings.TOKEN_KEY)
      .to("")
      .inScope(BindingScope.SINGLETON);
  }
  async boot(test = false) {
    await super.boot();

    const username = process.env.SYNAPSE_BOT_NAME;
    const password = process.env.SYNAPSE_BOT_PASSWORD;

    if (!test) {
      if (!username || !password) {
        throw new Error(
          "SCICHAT_BOT credential environment variable not defined",
        );
      }

      const userController = await this.get<UserController>(
        "controllers.UserController",
      );
      await userController.login({ username, password });
    }
  }
}
