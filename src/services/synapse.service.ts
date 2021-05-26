import { inject, Provider } from "@loopback/core";
import { getService } from "@loopback/service-proxy";
import { SynapseSyncResponse } from ".";
import { SynapseDataSource } from "../datasources";
import { SynapseToken } from "../models";

export interface SynapseService {
  login(username: string, password: string): Promise<SynapseToken>;
  searchUser(
    username: string,
    accessToken: string | undefined,
  ): Promise<{
    limited: boolean;
    results: [{ user_id: string; display_name: string; avatar_url: string }];
  }>;
  createRoom(
    name: string,
    invites: string[],
    accessToken: string | undefined,
  ): Promise<{ room_alias: string; room_id: string }>;
  fetchAllRoomsMessages(
    filter: string,
    accessToken: string | undefined,
  ): Promise<SynapseSyncResponse>;
  fetchRoomIdByName(
    name: string,
  ): Promise<{ room_id: string; servers: string[] }>;
  fetchRoomMessages(
    filter: string,
    accessToken: string | undefined,
  ): Promise<SynapseSyncResponse>;
  sendMessage(
    roomId: string,
    message: string,
    accessToken: string | undefined,
  ): Promise<{ event_id: string }>;
}

export class SynapseProvider implements Provider<SynapseService> {
  constructor(
    // synapse must match the name property in the datasource json file
    @inject("datasources.synapse")
    protected dataSource: SynapseDataSource = new SynapseDataSource(),
  ) {}

  value(): Promise<SynapseService> {
    return getService(this.dataSource);
  }
}
