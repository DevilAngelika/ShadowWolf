import { Channel, Interaction } from 'discord.js';

export function getChannel(interaction: Interaction, channelId: string): Channel {
  if (!interaction.guild) {
    throw new Error('Guild not found on getChannel action');
  }

  const channel = interaction.guild.channels.cache.get(channelId);

  if (undefined === channel) {
    throw new Error(`Channel ${channelId} not found on getChannel action`);
  }

  return channel;
}
