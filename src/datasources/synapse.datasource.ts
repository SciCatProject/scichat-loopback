import { inject, lifeCycleObserver, LifeCycleObserver } from "@loopback/core";
import { juggler } from "@loopback/repository";

const config = {
  name: "synapse",
  connector: "rest",
  baseURL: "https://scitest.esss.lu.se/_matrix/client/r0/",
  crud: false,
  options: {
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
  },
  operations: [
    {
      template: {
        method: "POST",
        url: "https://scitest.esss.lu.se/_matrix/client/r0/login",
        body: {
          type: "m.login.password",
          identifier: {
            type: "m.id.user",
            user: "{username:string}",
          },
          password: "{password:string}",
        },
      },
      functions: {
        login: ["username", "password"],
      },
    },
    {
      template: {
        method: "GET",
        url: "https://scitest.esss.lu.se/_matrix/client/r0/publicRooms",
      },
      functions: {
        fetchPublicRooms: [],
      },
    },
  ],
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver("datasource")
export class SynapseDataSource
  extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = "synapse";
  static readonly defaultConfig = config;

  constructor(
    @inject("datasources.config.synapse", { optional: true })
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
