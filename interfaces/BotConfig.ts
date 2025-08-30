interface ChannelConfig {
  defaultTchatting: string;
  liveId: string;
  ticketId: string;
}

interface SectionConfig {
  ticketId: string;
}

interface AclConfig {
  admin: string;
  streaming: string;
}

export interface BotConfig {
  acl: AclConfig;
  channels: ChannelConfig;
  sections: SectionConfig;
  names: Record<string, string>;
}
