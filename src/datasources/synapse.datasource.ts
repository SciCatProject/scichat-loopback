import {inject, lifeCycleObserver, LifeCycleObserver} from "@loopback/core";
import {juggler} from "@loopback/repository";

const baseURL = process.env.SYNAPSE_SERVER_HOST ?? "";

const config = {
  name: "synapse",
  connector: "rest",
  baseURL,
  crud: false,
  operations: [
    {
      template: {
        method: "POST",
        url: baseURL + "/_matrix/client/r0/login",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: {
          type: "m.login.password",
          identifier: {
            type: "m.id.user",
            user: "{!username:string}",
          },
          password: "{!password:string}",
        },
      },
      functions: {
        login: ["username", "password"],
      },
    },
    {
      template: {
        method: "POST",
        url:
          baseURL +
          "/_matrix/client/r0/rooms/{!name:string}/send/m.room.message",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          Authorization: "Bearer {!accessToken:string}",
        },
        body: {
          msgtype: "m.text",
          body: "{!message:text}",
        },
      },
      functions: {
        sendMessage: ["name", "message", "accessToken"],
      },
    },
    {
      template: {
        method: "GET",
        url: baseURL + "/_synapse/admin/v1/rooms?search_term={!name:string}",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          Authorization: "Bearer {!accessToken:string}",
        },
      },
      functions: {
        fetchRoomIdByName: ["name", "accessToken"],
      },
    },
    {
      template: {
        method: "GET",
        url: baseURL + "/_matrix/client/r0/sync?filter={filter:string}",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          Authorization: "Bearer {!accessToken:string}",
        },
      },
      functions: {
        fetchRoomMessages: ["filter", "accessToken"],
        fetchAllRoomsMessages: ["filter", "accessToken"],
      },
    },
    {
      template: {
        method: "GET",
        url: baseURL + "/_synapse/admin/v2/users/{!userId:string}",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          Authorization: "Bearer {!accessToken:string}",
        },
      },
      functions: {
        queryUser: ["userId", "accessToken"],
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
    @inject("datasources.config.synapse", {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
