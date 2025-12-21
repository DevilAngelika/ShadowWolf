import {
  APIInteractionDataResolvedGuildMember,
  ChatInputCommandInteraction,
  GuildMember,
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
  SlashCommandStringOption,
  SlashCommandUserOption,
} from 'discord.js';
import { config } from '../config';

const allowedRoles = [config.acl.admin];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bannir un membre')
    .addUserOption((option): SlashCommandUserOption => {
      return option.setName('membre').setRequired(true);
    })
    .addStringOption((option): SlashCommandStringOption => {
      return option.setName('motif').setRequired(false);
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction: ChatInputCommandInteraction) {
    if (interaction.member instanceof GuildMember) {
      if (!interaction.member.roles.cache.some((role) => allowedRoles.includes(role.id))) {
        console.error(`User ${interaction.member.user.username} try to use /ban command!`);
        return interaction.reply({
          content: `🚫 Vous ne pouvez pas exécuter la commande suivante. Si vous pensez que c'est une erreur, merci d'ouvrir un ticket.`,
          flags: MessageFlags.Ephemeral,
        });
      }
    }

    const member: GuildMember | APIInteractionDataResolvedGuildMember | null =
      interaction.options.getMember('membre');
    const reason =
      interaction.options.getString('motif') ??
      `Vous avez été banni du serveur de ${config.names.devilangelika}`;

    if (!member || !(member instanceof GuildMember)) {
      return interaction.reply({
        content: 'Utilisateur introuvable.',
        flags: MessageFlags.Ephemeral,
      });
    }

    if (!member.bannable) {
      console.error(
        `User ${member.user.username} (${member.user.id}) can't be ban to ${interaction.user.tag} (${interaction.user.id})`
      );

      return interaction.reply({
        content: `User ${member.user.username} (${member.user.id}) should not be ban`,
        flags: MessageFlags.Ephemeral,
      });
    }

    try {
      const dmMessage = `Vous avez été banni du serveur **${interaction.guild?.name}** pour la raison suivante : ${reason}`;
      await member.send(dmMessage).catch(() => {
        console.log(`Impossible d'envoyer un message privé à ${member.user.username}.`);
      });
    } catch (error: any) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Unable to send a private message to ${member.user.username} (${member.user.id})`;
      console.log(`Error during ban's command execution: ${errorMessage}`);
    }

    try {
      await interaction.guild?.members.ban(member.user.id, { reason });

      return interaction.reply({
        content: `✅ **${member.user.tag}** a été banni définitivement`,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue lors du ban';

      console.log(`Error during live command execution: ${errorMessage}`);
      return interaction.reply({
        content: `🚫 Une erreur est survenue durant l'execution de la commande /ban. Merci de contacter ${config.names.devilangelika}`,
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
