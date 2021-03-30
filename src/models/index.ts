export * from "./logbook.model";
export * from "./room.model";
export * from "./synapse-login-response.model";
export * from "./synapse-room-id-response.model";
export * from "./synapse-sync-response.model";

export interface SynapseRooms {
  invite: Record<string, unknown>;
  join: Record<string, unknown>;
  leave: Record<string, unknown>;
}
