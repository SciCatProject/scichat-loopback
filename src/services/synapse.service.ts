import { inject, Provider } from "@loopback/core";
import { getService } from "@loopback/service-proxy";
import { SynapseAdminUserResponse, SynapseSyncResponse } from ".";
import { SynapseDataSource } from "../datasources";
import { SynapseToken } from "../models";

export interface SynapseService {
  login(username: string, password: string): Promise<SynapseToken>;
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
  queryUser(
    userId: string,
    accessToken: string | undefined,
  ): Promise<SynapseAdminUserResponse>;
  createUser(
    userId: string,
    username: string,
    password: string,
    accessToken: string | undefined,
  ): Promise<SynapseAdminUserResponse>;
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
