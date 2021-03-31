export * from "./logbook.model";
export * from "./synapse-login-response.model";
export * from "./synapse-room-id-response.model";
export * from "./synapse-send-message-response.model";
export * from "./synapse-sync-response.model";

export interface SynapseEvent {
  type: string;
  sender: string;
  origin_server_ts: number;
  unsigned: {
    age: number;
  };
  event_id: string;
}
export interface SynapseStateEvent extends SynapseEvent {
  content: {
    name: string;
  };
  state_key: string;
}
export interface SynapseTimelineEvent extends SynapseEvent {
  content: {
    msgtype: string;
    body: string;
    url?: string;
  };
}
export interface SynapseJoinedRoom {
  timeline: {
    events: SynapseTimelineEvent[];
  };
  state: {
    events: SynapseStateEvent[];
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
