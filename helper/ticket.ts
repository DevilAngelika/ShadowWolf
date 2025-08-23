import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ColorResolvable,
  Colors,
  EmbedBuilder,
  GuildMember,
  GuildMemberRoleManager,
  Interaction,
  MessageFlags,
  PermissionsBitField,
  TextBasedChannel,
  TextChannel,
} from 'discord.js';
import { config } from '../config';
import { createEmbed } from './embed';
import { createButton } from './button';

export async function createTicket(name: string, interaction: Interaction) {
  const username: string = interaction.user.username;
  const channelName: string = `${name}${username}`;

  if (!interaction.guild) {
    throw new Error(`Guild not found when we want create ticket`);
  }

  const ticketChannel: TextChannel = await interaction.guild.channels.create({
    name: channelName,
    type: ChannelType.GuildText,
    parent: config.sections.ticketId,
    permissionOverwrites: [
      {
        id: interaction.guild.roles.everyone,
        deny: [PermissionsBitField.Flags.ViewChannel],
      },
      {
        id: interaction.user.id,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.AttachFiles,
          PermissionsBitField.Flags.EmbedLinks,
          PermissionsBitField.Flags.ReadMessageHistory,
        ],
      },
      {
        id: config.acl.admin,
        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
      },
    ],
  });

  let description: string = '';
  let colorEmbed: ColorResolvable = Colors.Blue;

  switch (name) {
    case 'plainte-':
      description = `Salut <@${interaction.user.id}> ! ⚠️
            Tu as ouvert un ticket pour signaler un problème ou déposer une plainte.

            Pour que nous puissions traiter ta demande le plus efficacement possible :

            📝 Décris clairement la situation : que s'est-il passé, où et quand ?
            ✅ Fournis toutes les preuves nécessaires : captures d'écran, liens vers les messages, etc.
            🤫 Ton signalement est traité de manière strictement confidentielle par l'équipe de modération.

            Nous t'invitons à donner le plus de détails possible ici. 
            Notre équipe examinera attentivement les informations que tu as fournies et agira en conséquence.
            Nous sommes désolée pour ceci.`;
      colorEmbed = Colors.Red;
      break;
    case 'membre-':
      description = `Salut et bienvenue <@${interaction.user.id}> ! 👋
                Tu as ouvert un ticket pour devenir membre du serveur.
                Voici ce que cela signifie :

                ✅ En tant que membre, tu auras accès à toutes les sections principales du serveur :
                🎶 Musique – 🎮 Gaming – ✍️ Écriture – 💬 Discussions générales...

                🚫 L’accès à la section "Contenu adulte / Pornographique" n’est pas inclus avec le rôle de membre.
                Cette partie est réservée à un processus séparé avec vérification et accord spécifique.`;
      colorEmbed = Colors.Green;
      break;
    default:
      description = `Salut <@${interaction.user.id}> ! 👋
            Ton ticket a bien été ouvert.

            Pour que notre équipe puisse t'aider au mieux, merci de nous donner plus d'informations ici :

            ✅ **Décris ta demande :** S'agit-il d'une question, d'une suggestion, d'une requête d'aide, ou d'une autre raison ?
            📝 **Sois précis(e) :** Plus tu nous donnes de détails, plus nous pourrons t'assister rapidement et efficacement.

            Un membre de l'équipe prendra connaissance de ton message et te répondra dans les plus brefs délais. 
            Merci de ta patience !`;
  }

  const ticketEmbed: EmbedBuilder = createEmbed(channelName, description, colorEmbed);

  const closeTicketButton: ButtonBuilder = createButton(
    'close',
    'Fermer le ticket',
    ButtonStyle.Danger
  );

  const rowAction: ActionRowBuilder<ButtonBuilder> =
    new ActionRowBuilder<ButtonBuilder>().addComponents(closeTicketButton);

  await ticketChannel.send({
    content: `<@${interaction.user.id}> <@&${config.acl.admin}>`,
    embeds: [ticketEmbed],
    components: [rowAction],
  });

  if (!interaction.isRepliable()) {
    return;
  }

  interaction.reply({
    content: `Votre ticket pour **${channelName}** a été créé : <#${ticketChannel.id}>`,
    flags: MessageFlags.Ephemeral,
  });
}

export async function closeTicket(interaction: Interaction) {
  if (!interaction.isRepliable()) {
    return;
  }

  if (!interaction.member || !(interaction.member instanceof GuildMember)) {
    return interaction.reply({
      content: 'Une erreur est survenue lors de la récupération de vos permissions.',
      flags: MessageFlags.Ephemeral,
    });
  }

  if (!(interaction.member.roles instanceof GuildMemberRoleManager)) {
    return interaction.reply({
      content: 'Une erreur est survenue lors de la vérification des permissions.',
      flags: MessageFlags.Ephemeral,
    });
  }

  if (!interaction.member.roles.cache.has(config.acl.admin)) {
    return interaction.reply({
      content: "Vous n'avez pas la permission de fermer ce ticket.",
      flags: MessageFlags.Ephemeral,
    });
  }

  const channel: TextBasedChannel | null = interaction.channel;
  if (channel === null) {
    return;
  }

  await interaction.reply('Ce ticket sera fermé dans 5 secondes…');
  setTimeout(async () => {
    try {
      await channel.delete();
    } catch (err) {
      console.error('Erreur de suppression du canal :', err);
    }
  }, 5000);
}
