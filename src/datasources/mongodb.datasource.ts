import { inject, lifeCycleObserver, LifeCycleObserver } from "@loopback/core";
import { juggler } from "@loopback/repository";

const config = {
  name: "mongodb",
  connector: "mongodb",
  url: "",
  host: process.env.MONGODB_HOST ?? "mongodb",
  port: process.env.MONGODB_PORT ?? 27017,
  user: process.env.MONGODB_USER ?? "",
  password: process.env.MONGODB_PASSWORD ?? "",
  database: process.env.MONGODB_DB_NAME ?? "scichat",
  useNewUrlParser: true,
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver("datasource")
export class MongodbDataSource
  extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = "mongodb";
  static readonly defaultConfig = config;

  constructor(
    @inject("datasources.config.mongodb", { optional: true })
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
