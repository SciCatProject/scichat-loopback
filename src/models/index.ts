export * from "./logbook.model";
export * from "./room.model";
export * from "./synapse-login-response.model";
export * from "./synapse-room-id-response.model";
export * from "./synapse-sync-response.model";

export interface SynapseTimelineEvent {
  type: string;
  sender: string;
  content: {
    msgtype: string;
    body: string;
    url?: string;
  };
  origin_server_ts: number;
  unsigned: {
    age: number;
  };
  event_id: string;
}
export interface SynapseJoinedRoom {
  timeline: {
    events: object[];
  };
  state: {
    events: SynapseTimelineEvent[];
  };
  account_data: unknown[];
  ephemeral: unknown[];
  unread_notifications: {
    notification_count: number;
    highlight_count: number;
  };
  summary: unknown;
}
export interface SynapseRooms {
  invite: Record<string, unknown>;
  join: Record<string, SynapseJoinedRoom>;
  leave: Record<string, unknown>;
}
