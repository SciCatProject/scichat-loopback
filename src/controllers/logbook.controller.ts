import { authenticate } from "@loopback/authentication";
import { inject, intercept } from "@loopback/core";
import { repository } from "@loopback/repository";
import {
  api,
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
  SchemaObject,
} from "@loopback/rest";

import { LogbookInterceptor } from "../interceptors";
import { Logbook, Message } from "../models";
import { SynapseTokenRepository } from "../repositories";
import { SynapseService, SynapseTimelineEvent } from "../services";
import { Utils } from "../utils";

export type CreateLogbookDetails = {
  name: string;
  invites?: string[];
};

export type ChatRoom = {
  canonical_alias: string;
  name: string;
  room_id: string;
  creator: string;
  guest_access: string;
  history_visibility: string;
  join_rules: string;
  public: boolean;
};

export interface LogbookFilters {
  roomId?: string;
  textSearch: string;
  showBotMessages: boolean;
  showUserMessages: boolean;
  showImages: boolean;
}

export interface SynapseFilters {
  account_data: { not_types: string[] };
  presence: { not_types: string[] };
  room: {
    rooms?: string[];
    state: { types: string[] };
    timeline: {
      limit: number;
      types: string[];
      not_senders?: string[];
      senders?: string[];
    };
  };
}

const createLogbookSchema: SchemaObject = {
  type: "object",
  required: ["name"],
  properties: {
    name: {
      type: "string",
    },
    invites: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
  example: {
    name: "123456",
    invites: ["firstnamelastname"],
  },
};

export const createLogbookRequestBody = {
  description: "The input of create Logbook",
  required: true,
  content: {
    "application/json": { schema: createLogbookSchema },
  },
};

const sendMessageSchema: SchemaObject = {
  type: "object",
  required: ["message"],
  properties: {
    message: {
      type: "string",
    },
  },
};

export const sendMessageRequestBody = {
  description: "The message to be sent to the room",
  required: true,
  content: {
    "application/json": { schema: sendMessageSchema },
  },
};

@intercept(LogbookInterceptor.BINDING_KEY)
@api({ basePath: "/scichatapi" })
export class LogbookController {
  username = process.env.SYNAPSE_BOT_NAME ?? "";
  password = process.env.SYNAPSE_BOT_PASSWORD ?? "";
  serverName = process.env.SYNAPSE_SERVER_NAME ?? "ess";
  userId = `@${this.username}:${this.serverName}`;
  constructor(
    @repository(SynapseTokenRepository)
    public synapseTokenRepository: SynapseTokenRepository,
    @inject("services.Synapse") protected synapseService: SynapseService,
    @inject("utils") protected utils: Utils,
  ) {}

  @authenticate("jwt")
  @get("/Logbooks", {
    parameters: [
      {
        name: "filter",
        schema: { title: "Filter", type: "string" },
        in: "query",
      },
    ],
    responses: {
      "200": {
        description: "Array of Logbook model instances",
        content: {
          "application/json": {
            schema: {
              type: "array",
              items: getModelSchemaRef(Logbook),
            },
          },
        },
      },
    },
  })
  async find(): Promise<Logbook[] | undefined> {
    do {
      try {
        const synapseToken = await this.synapseTokenRepository.findOne({
          where: { user_id: this.userId },
        });
        const accessToken = synapseToken?.access_token;
        const filter = this.createSynapseFilter();
        console.log("Fetching messages for all rooms");
        const { rooms } = await this.synapseService.fetchAllRoomsMessages(
          filter,
          accessToken,
        );
        const logbooks = Object.keys(rooms.join)
          .map(
            (roomId) =>
              new Logbook({
                roomId,
                name: rooms.join[roomId].state.events
                  .map((event) => event.content["name"])
                  .pop(),
                messages: rooms.join[roomId].timeline.events,
              }),
          )
          .filter((room) => room.roomId && room.name && room.messages);
        return logbooks.map((logbook) => this.formatImageUrls(logbook));
      } catch (err) {
        if (
          err.error &&
          (err.error.errcode === "M_UNKNOWN_TOKEN" ||
            err.error.errcode === "M_MISSING_TOKEN")
        ) {
          await this.utils.renewAccessToken();
          continue;
        } else {
          console.error(err);
        }
      }
      break;
    } while (true);
  }

  @authenticate("jwt")
  @post("/Logbooks", {
    responses: {
      "200": {
        description: "Create Room Response",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                room_id: {
                  type: "string",
                },
                room_alias: {
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
  })
  async create(
    @requestBody(createLogbookRequestBody) details: CreateLogbookDetails,
  ): Promise<{ room_alias: string; room_id: string } | undefined> {
    do {
      try {
        const { name, invites } = details;
        return await this.utils.createRoom(name, invites);
      } catch (err) {
        if (
          err.error &&
          (err.error.errcode === "M_UNKNOWN_TOKEN" ||
            err.error.errcode === "M_MISSING_TOKEN")
        ) {
          await this.utils.renewAccessToken();
          continue;
        } else {
          console.error(err);
        }
      }
      break;
    } while (true);
  }

  @authenticate("jwt")
  @get("/Logbooks/{name}", {
    parameters: [
      {
        name: "name",
        schema: { title: "name", type: "string" },
        in: "path",
      },
      {
        name: "filter",
        schema: { title: "filter", type: "object" },
        in: "query",
      },
    ],
    responses: {
      "200": {
        description: "Logbook model instance",
        content: {
          "application/json": {
            schema: getModelSchemaRef(Logbook),
          },
        },
      },
    },
  })
  async findByName(
    @param.path.string("name") name: string,
    @param.query.string("filter")
    filter?: string,
  ): Promise<Logbook | undefined> {
    do {
      try {
        const synapseToken = await this.synapseTokenRepository.findOne({
          where: { user_id: this.userId },
        });
        const accessToken = synapseToken?.access_token;
        const allRooms = await this.synapseService.fetchRoomIdByName(
          name,
          accessToken,
        );

        const roomId = allRooms.rooms[0].room_id;

        const defaultFilter: LogbookFilters = {
          textSearch: "",
          showBotMessages: true,
          showUserMessages: true,
          showImages: true,
        };
        const logbookFilter: LogbookFilters = filter
          ? { ...defaultFilter, ...JSON.parse(filter) }
          : defaultFilter;
        logbookFilter.roomId = roomId;
        const synapseFilter = this.createSynapseFilter(logbookFilter);
        const { rooms } = await this.synapseService.fetchRoomMessages(
          synapseFilter,
          accessToken,
        );
        const events: SynapseTimelineEvent[] =
          rooms.join[roomId].timeline.events;
        const messages = this.filterMessages(events, logbookFilter);

        const messagesWithDisplayName = await this.getMessagesWithDisplayName(
          messages,
          accessToken,
        );

        const logbook = new Logbook({
          roomId,
          name,
          messages: messagesWithDisplayName,
        });

        return this.formatImageUrls(logbook);
      } catch (err) {
        if (
          err.error &&
          (err.error.errcode === "M_UNKNOWN_TOKEN" ||
            err.error.errcode === "M_MISSING_TOKEN")
        ) {
          await this.utils.renewAccessToken();
          continue;
        } else {
          console.error(err);
        }
      }
      break;
    } while (true);
  }

  @authenticate("jwt")
  @post("/Logbooks/{name}/message", {
    responses: {
      "200": {
        description: "Send Message Response",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                event_id: {
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
  })
  async sendMessage(
    @param.path.string("name") name: string,
    @requestBody(sendMessageRequestBody) data: { [message: string]: string },
  ): Promise<{ event_id: string } | undefined> {
    do {
      try {
        const synapseToken = await this.synapseTokenRepository.findOne({
          where: { user_id: this.userId },
        });
        const accessToken = synapseToken?.access_token;
        const roomAlias = encodeURIComponent(`#${name}:${this.serverName}`);
        const allRooms = await this.synapseService.fetchRoomIdByName(
          roomAlias,
          accessToken,
        );

        const roomId = allRooms.rooms[0].room_id;

        const { message } = data;
        return await this.synapseService.sendMessage(
          roomId,
          message,
          accessToken,
        );
      } catch (err) {
        if (
          err.error &&
          (err.error.errcode === "M_UNKNOWN_TOKEN" ||
            err.error.errcode === "M_MISSING_TOKEN")
        ) {
          await this.utils.renewAccessToken();
          continue;
        } else {
          console.error(err);
        }
      }
      break;
    } while (true);
  }

  createSynapseFilter = (options?: LogbookFilters): string => {
    const filter: SynapseFilters = {
      account_data: { not_types: ["m.*", "im.*"] },
      presence: { not_types: ["*"] },
      room: {
        state: { types: ["m.room.name"] },
        timeline: {
          limit: 1000000,
          types: ["m.room.message"],
        },
      },
    };
    if (options) {
      if (options.roomId) {
        filter.room.rooms = [options.roomId];
      }
      if (!options.showBotMessages) {
        filter.room.timeline.not_senders = [
          `@${this.username}:${this.serverName}`,
        ];
      }
      if (!options.showUserMessages) {
        filter.room.timeline.senders = [`@${this.username}:${this.serverName}`];
      }
    }
    return JSON.stringify(filter);
  };

  filterMessages = (
    events: SynapseTimelineEvent[],
    filter?: LogbookFilters,
  ): SynapseTimelineEvent[] => {
    let messages = events;
    if (filter) {
      if (filter.textSearch) {
        const pattern = new RegExp(".*" + filter.textSearch + ".*", "i");
        messages = messages.filter((message) =>
          message.content.body ? message.content.body.match(pattern) : true,
        );
      }
      if (!filter.showImages) {
        messages = messages.filter(
          (message) => message.content.msgtype !== "m.image",
        );
      }
    }
    return messages;
  };

  getMessagesWithDisplayName = async (
    messages: Message[],
    token: string | undefined,
  ) => {
    const users = new Map();
    const messagesWithDisplayName = await Promise.all(
      messages.map(async (message) => {
        if (!users.get(message.sender)) {
          const { displayname, name: userId } =
            await this.synapseService.queryUser(message.sender, token);

          const modifiedUserId = userId.slice(1).replace(":ess", "");
          users.set(message.sender, displayname ? displayname : modifiedUserId);
        }
        return { ...message, senderName: users.get(message.sender) };
      }),
    );
    return messagesWithDisplayName;
  };

  formatImageUrls = (logbook: Logbook): Logbook => {
    if (logbook?.messages) {
      logbook.messages.forEach((message) => {
        if (message.content.msgtype === "m.image") {
          if (message.content.info?.thumbnail_url) {
            const externalThumbnailUrl =
              message.content.info.thumbnail_url.replace(
                "mxc://",
                `${process.env.SYNAPSE_SERVER_HOST}/_matrix/media/r0/download/`,
              );
            message.content.info.thumbnail_url = externalThumbnailUrl;
          }
          if (message.content.url) {
            const externalFullsizeUrl = message.content.url.replace(
              "mxc://",
              `${process.env.SYNAPSE_SERVER_HOST}/_matrix/media/r0/download/`,
            );
            message.content.url = externalFullsizeUrl;
          }
        }
      });
    }
    return logbook;
  };
}
