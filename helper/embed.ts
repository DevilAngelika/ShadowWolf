import { ColorResolvable, EmbedBuilder } from 'discord.js';

export function createEmbed(
  title: string,
  description: string,
  color: ColorResolvable = 'Blue',
  image: string | null = null
): EmbedBuilder {
  const embed = new EmbedBuilder().setTitle(title).setDescription(description).setColor(color);

  if (image) {
    embed.setImage(image);
  }

  return embed;
}
