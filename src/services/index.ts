export * from "./jwt.auth.strategy";
export * from "./jwt.service";
export * from "./security.spec.enhancer";
export * from "./synapse.service";
export * from "./user.service";

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

export interface SynapseSyncResponse {
  account_data: object;
  to_device: object;
  device_lists: object;
  presence: object;
  rooms: SynapseRooms;
  groups: object;
  device_one_time_keys_count: object;
  next_batch: string;
}
