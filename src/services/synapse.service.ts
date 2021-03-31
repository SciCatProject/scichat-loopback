import { inject, Provider } from "@loopback/core";
import { getService } from "@loopback/service-proxy";
import { SynapseDataSource } from "../datasources";
import { SynapseLoginResponse, SynapseSyncResponse } from "../models";

export interface Synapse {
  login(username: string, password: string): Promise<SynapseLoginResponse>;
  createRoom(
    name: string,
    accessToken: string,
  ): Promise<{ room_alias: string; room_id: string }>;
  fetchAllRoomsMessages(
    filter: string,
    accessToken: string,
  ): Promise<SynapseSyncResponse>;
  fetchRoomIdByName(
    name: string,
  ): Promise<{ room_id: string; servers: string[] }>;
  fetchRoomMessages(
    filter: string,
    accessToken: string,
  ): Promise<SynapseSyncResponse>;
  fetchPublicRooms(accessToken: string): Promise<object>;
  sendMessage(
    roomId: string,
    message: string,
    accessToken: string,
  ): Promise<{ event_id: string }>;
}

export class SynapseProvider implements Provider<Synapse> {
  constructor(
    // synapse must match the name property in the datasource json file
    @inject("datasources.synapse")
    protected dataSource: SynapseDataSource = new SynapseDataSource(),
  ) {}

  value(): Promise<Synapse> {
    return getService(this.dataSource);
  }
}
