import { ColorResolvable, EmbedBuilder } from 'discord.js';

export function createEmbed(title: string, description: string, color: ColorResolvable = 'Blue'): EmbedBuilder
{
    return (new EmbedBuilder())
        .setTitle(title)
        .setDescription(description)
        .setColor(color);
}