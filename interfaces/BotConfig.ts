interface ChannelConfig {
  defaultTchatting: string;
  ticketId: string;
}

interface AclConfig {
  admin: string;
}

export interface BotConfig {
  acl: AclConfig;
  channels: ChannelConfig;
}
