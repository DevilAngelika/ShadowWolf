import { ColorResolvable, EmbedBuilder } from 'discord.js';

export function createEmbed(
  title: string,
  description: string,
  color: ColorResolvable = 'Blue',
  imageName: string | null = null
): EmbedBuilder {
  const embed = new EmbedBuilder().setTitle(title).setDescription(description).setColor(color);

  if (imageName) {
    embed.setImage(`attachment://${imageName}`);
  }

  return embed;
}
