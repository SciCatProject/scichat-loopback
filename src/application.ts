import { AuthenticationComponent } from "@loopback/authentication";
import { BootMixin } from "@loopback/boot";
import { ApplicationConfig } from "@loopback/core";
import { RepositoryMixin } from "@loopback/repository";
import { RestApplication } from "@loopback/rest";
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from "@loopback/rest-explorer";
import { ServiceMixin } from "@loopback/service-proxy";
import {
  ConsumersBooter,
  QueueComponent,
  RabbitmqBindings,
  RabbitmqComponent,
  RabbitmqComponentConfig,
} from "loopback-rabbitmq";
import path from "path";
import { MongodbDataSource } from "./datasources";
import { JWTAuthenticationComponent } from "./jwt-authentication-component";
import { UserServiceBindings, UtilsBindings } from "./keys";
import { MySequence } from "./sequence";
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

    // Set up RabbitMQ
    const rabbitMqEnabled = process.env.RABBITMQ_ENABLED ?? "no";
    if (rabbitMqEnabled === "yes") {
      this.configure<RabbitmqComponentConfig>(RabbitmqBindings.COMPONENT).to({
        options: {
          protocol: process.env.RABBITMQ_PROTOCOL ?? "amqp",
          hostname: process.env.RABBITMQ_HOST ?? "localhost",
          port:
            process.env.RABBITMQ_PORT === undefined
              ? 5672
              : +process.env.RABBITMQ_PORT,
          username: process.env.RABBITMQ_USER ?? "rabbitmq",
          password: process.env.RABBITMQ_PASSWORD ?? "rabbitmq",
          vhost: process.env.RABBITMQ_VHOST ?? "/",
        },
      });
      this.component(RabbitmqComponent);
      this.booters(ConsumersBooter);
      this.component(QueueComponent);

      this.bootOptions["consumers"] = {
        dirs: ["consumers"],
        extensions: [".consumer.js"],
        nested: true,
      };
    }

    // Mount authentication system
    this.component(AuthenticationComponent);
    // Mount jwt component
    this.component(JWTAuthenticationComponent);
    // Bind datasource
    this.dataSource(MongodbDataSource, UserServiceBindings.DATASOURCE_NAME);

    this.bind(UtilsBindings.UTILS).toClass(Utils);
  }
}
