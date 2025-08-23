interface ChannelConfig {
  defaultTchatting: string;
  ticketId: string;
}

interface SectionConfig {
  ticketId: string;
}

interface AclConfig {
  admin: string;
}

export interface BotConfig {
  acl: AclConfig;
  channels: ChannelConfig;
  sections: SectionConfig;
}
