import { inject } from "@loopback/core";
import {
  api,
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
} from "@loopback/rest";
import {
  Logbook,
  SynapseSendMessageResponse,
  SynapseTimelineEvent,
} from "../models";
import { Synapse } from "../services";

export interface CreateLogbookDetails {
  name: string;
  invites?: string[];
}

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

const username = process.env.SYNAPSE_BOT_NAME ?? "";
const password = process.env.SYNAPSE_BOT_PASSWORD ?? "";
const serverName = process.env.SYNAPSE_SERVER_NAME ?? "ess";

@api({ basePath: "/scichatapi" })
export class LogbookController {
  constructor(@inject("services.Synapse") protected synapseService: Synapse) {}

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
  async find(): Promise<Logbook[]> {
    const { access_token: accessToken } = await this.synapseService.login(
      username,
      password,
    );
    const filter = createSynapseFilter();
    const { rooms } = await this.synapseService.fetchAllRoomsMessages(
      filter,
      accessToken,
    );
    return Object.keys(rooms.join)
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
  }

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
    @requestBody() details: CreateLogbookDetails,
  ): Promise<{ room_alias: string; room_id: string }> {
    const { access_token: accessToken } = await this.synapseService.login(
      username,
      password,
    );
    const { name } = details;
    return this.synapseService.createRoom(name, accessToken);
  }

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
  ): Promise<Logbook> {
    const { access_token: accessToken } = await this.synapseService.login(
      username,
      password,
    );
    const roomAlias = encodeURIComponent(`#${name}:${serverName}`);
    const { room_id: roomId } = await this.synapseService.fetchRoomIdByName(
      roomAlias,
    );
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
    const synapseFilter = createSynapseFilter(logbookFilter);
    const { rooms } = await this.synapseService.fetchRoomMessages(
      synapseFilter,
      accessToken,
    );
    const events: SynapseTimelineEvent[] = rooms.join[roomId].timeline.events;
    const messages = filterMessages(events, logbookFilter);
    return new Logbook({ roomId, name, messages });
  }

  @post("/Logbooks/{name}/message", {
    responses: {
      "200": {
        description: "Send Message Response",
        content: {
          "application/json": {
            schema: getModelSchemaRef(SynapseSendMessageResponse),
          },
        },
      },
    },
  })
  async sendMessage(
    @param.path.string("name") name: string,
    @requestBody() data: { [message: string]: string },
  ): Promise<SynapseSendMessageResponse> {
    const { access_token: accessToken } = await this.synapseService.login(
      username,
      password,
    );
    const roomAlias = encodeURIComponent(`#${name}:${serverName}`);
    const { room_id: roomId } = await this.synapseService.fetchRoomIdByName(
      roomAlias,
    );
    const { message } = data;
    return this.synapseService.sendMessage(roomId, message, accessToken);
  }
}

const createSynapseFilter = (options?: LogbookFilters): string => {
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
      filter.room.timeline.not_senders = [`@${username}:${serverName}`];
    }
    if (!options.showUserMessages) {
      filter.room.timeline.senders = [`@${username}:${serverName}`];
    }
  }
  return JSON.stringify(filter);
};

const filterMessages = (
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
