import { Client, TextChannel, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { config } from '../config';
import { createButton } from '../helper/button';
import { createEmbed } from '../helper/embed';

export function sendButtons(client: Client) {
    const complaintTicketing: ButtonBuilder = createButton('complaint', 'Déposer une plainte', ButtonStyle.Danger);
    const memberTicketing: ButtonBuilder = createButton('new-member', 'Devenir membre');
    const otherTicketing: ButtonBuilder = createButton('other', 'Autres demandes', ButtonStyle.Secondary);
    const suggestTicketing: ButtonBuilder = createButton('suggest', 'Suggestion pour le serveur', ButtonStyle.Secondary)


    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        memberTicketing,
        complaintTicketing,
        suggestTicketing,
        otherTicketing
    );

    const embedTicketing = createEmbed('Système de Tickets', 'Sélectionnez une option pour ouvrir un ticket');

    const ticketingChannel = client.channels.cache.get(config.channels.ticketId) as TextChannel;
    if (ticketingChannel) {
        ticketingChannel.send({ embeds: [embedTicketing], components: [row] });
    } else {
        console.error('Ticketing channel not found');
    }
}
