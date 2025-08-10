import { EmbedBuilder } from 'discord.js';

export function createEmbed(title: string, description: string): EmbedBuilder
{
    return (new EmbedBuilder())
        .setTitle(title)
        .setDescription(description);
}