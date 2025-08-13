import { ButtonBuilder, ButtonStyle } from 'discord.js';

export function createButton(
  id: string,
  label: string,
  color: ButtonStyle = ButtonStyle.Primary
): ButtonBuilder {
  return new ButtonBuilder().setCustomId(id).setLabel(label).setStyle(color);
}
