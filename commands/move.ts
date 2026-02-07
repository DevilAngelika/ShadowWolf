import {
  ActionRowBuilder,
  ChannelType,
  ChatInputCommandInteraction,
  Collection,
  ComponentType,
  GuildMember,
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
  UserSelectMenuBuilder,
  VoiceChannel,
  StageChannel,
} from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('move')
    .setDescription('Déplace plusieurs membres vers un autre salon vocal')
    .setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers)
    .addChannelOption((option) =>
      option
        .setName('destination')
        .setDescription('Le salon de destination')
        .addChannelTypes(ChannelType.GuildVoice, ChannelType.GuildStageVoice)
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const channelVoice = interaction.options.getChannel('destination') as
      | VoiceChannel
      | StageChannel
      | null;

    if (!channelVoice) {
      return interaction.reply({
        content: "Le salon demandé n'existe pas ou n'est pas accessible.",
        flags: MessageFlags.Ephemeral,
      });
    }

    const memberSelect = new UserSelectMenuBuilder()
      .setCustomId('moveMembers')
      .setPlaceholder('Sélectionne les membres')
      .setMinValues(1)
      .setMaxValues(10);

    const row = new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(memberSelect);

    const response = await interaction.reply({
      content: `Qui doit être déplacé vers **${channelVoice.name}** ?`,
      components: [row],
      flags: MessageFlags.Ephemeral,
    });

    const collector = response.createMessageComponentCollector({
      componentType: ComponentType.UserSelect,
      time: 60000,
    });

    collector.on('collect', async (i) => {
      if (i.customId === 'moveMembers') {
        await i.deferUpdate();

        const members = i.members as Collection<string, GuildMember>;
        let movedCount = 0;
        let errorCount = 0;

        for (const member of members.values()) {
          if (member.voice.channel) {
            try {
              await member.voice.setChannel(channelVoice);
              movedCount++;
            } catch (err) {
              console.error(`Erreur pour ${member.user.tag}:`, err);
              errorCount++;
            }
          } else {
            errorCount++;
          }
        }

        await i.editReply({
          content: `✅ Déplacement terminé : **${movedCount}** membres déplacés.\n❌ Échecs (pas en vocal ou erreur) : **${errorCount}**`,
          components: [],
        });
      }
    });

    collector.on('end', async (collected) => {
      if (collected.size === 0) {
        // On vérifie si l'interaction n'a pas été supprimée entre temps
        await interaction
          .editReply({
            content: 'Temps écoulé, commande annulée.',
            components: [],
          })
          .catch(() => null);
      }
    });
  },
};
