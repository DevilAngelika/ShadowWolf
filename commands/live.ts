import {
  ChatInputCommandInteraction,
  Colors,
  MessageFlags,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from 'discord.js';
import { config } from '../config';
import { createEmbed } from '../helper/embed';
import { getChannel } from '../helper/channel';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('live')
    .setDescription('live on twitch')
    .addStringOption((option): SlashCommandStringOption => {
      return option
        .setName('stream')
        .setDescription('Choose who is on live')
        .setRequired(true)
        .setChoices(
          { name: 'Devilangelika', value: 'devilangelika' },
          { name: 'Mi', value: 'mi' },
          { name: 'Mi & Devil', value: 'mi-devil' }
        );
    }),

  async execute(interaction: ChatInputCommandInteraction) {
    if (interaction.member?.roles) {
      console.error(`User ${interaction.member.user.username} should not use /live command !`);
      return interaction.reply({
        content: `🚫 Vous ne pouvez pas executer la commande suivante. Si vous devriez y avoir, merci d'ouvrir un ticket`,
        flags: MessageFlags.Ephemeral,
      });
    }

    try {
      const streaming = interaction.options.getString('stream');

      let description: string = '';

      const baseDescription: string = `est en live !!!
      
      Venez la rejoindre et la suivre dans ses aventures:
      `;
      let image: string | null = null;
      const title: string = `C'est l'heure du live`;

      switch (streaming) {
        case 'devilangelika':
          description = `𝒟𝑒𝓋𝒾𝓁♡𝒜𝓃𝑔𝑒𝓁𝒾𝓀𝒶 ${baseDescription} https://www.twitch.tv/devilangelika `;
          image = '';
          break;
        case 'mi':
          break;
        case 'mi-devil':
          description = `Mi et 𝒟𝑒𝓋𝒾𝓁♡𝒜𝓃𝑔𝑒𝓁𝒾𝓀𝒶 sont en live toutes les deux !! 
          
          Venez suivre leur aventure sur leur deux lives :
          https://www.twitch.tv/miission2567 et https://www.twitch.tv/devilangelika`;
          break;
      }

      const embed = createEmbed(title, description, Colors.Purple, image);

      const channel = getChannel(interaction, config.channels.liveId);

      if (!channel.isSendable()) {
        throw new Error(`Channel ${config.channels.liveId} was not found`);
      }

      channel.send({ embeds: [embed] });
    } catch (error: unknown) {
      let message = 'An unknown error occurred.';

      if (typeof error === 'string') {
        message = error.toUpperCase();
      } else if (error instanceof Error) {
        message = error.message;
      }

      console.log(`Error during live command execution: ${message}`);
      return interaction.reply({
        content: `🚫 Une erreur est survenue durant l'execution de la commande /live. Merci de contacter ${config.names.devilangelika}`,
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
