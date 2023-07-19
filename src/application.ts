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
      //
      .inScope(BindingScope.SINGLETON);

    this.bind(TokenServiceBindings.TOKEN_KEY)
      .to("")
      .inScope(BindingScope.SINGLETON);
  }
}
