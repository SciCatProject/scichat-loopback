import { inject, Provider } from "@loopback/core";
import { SynapseAdminUserResponse, SynapseSyncResponse } from ".";
import { ChatRoom } from "../controllers";
import { SynapseDataSource } from "../datasources";
import { SynapseToken } from "../models";

export interface SynapseService {
  login(username: string, password: string): Promise<SynapseToken>;
  fetchAllRoomsMessages(
    filter: string,
    accessToken: string | undefined,
  ): Promise<SynapseSyncResponse>;
  fetchRoomIdByName(
    name: string,
    accessToken: string | undefined,
  ): Promise<{ offset: number; rooms: ChatRoom[]; total_rooms: number }>;
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
}

export class SynapseProvider implements Provider<SynapseService> {
  constructor(
    // synapse must match the name property in the datasource json file
    @inject("datasources.synapse")
    protected dataSource: SynapseDataSource = new SynapseDataSource(),
  ) {}

  value(): any {
    return console.log("--check");
  }
}
