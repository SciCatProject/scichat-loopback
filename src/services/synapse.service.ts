import { inject, Provider } from "@loopback/core";
import { getService } from "@loopback/service-proxy";
import { SynapseDataSource } from "../datasources";
import { SynapseLoginResponse, SynapseRoomIdResponse } from "../models";

export interface Message {
  message: string;
}
export interface Synapse {
  login(username: string, password: string): Promise<SynapseLoginResponse>;
  createRoom(
    accessToken: string,
    name: string,
    invite?: string[],
  ): Promise<object>;
  fetchAllRoomsMessages(accessToken: string, options?: object): Promise<object>;
  fetchRoomIdByName(name: string): Promise<SynapseRoomIdResponse>;
  fetchRoomMessages(
    roomId: string,
    accessToken: string,
    options?: object,
  ): Promise<object>;
  fetchPublicRooms(accessToken: string): Promise<object>;
  sendMessage(
    accessToken: string,
    roomId: string,
    data: Message,
  ): Promise<object>;
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
