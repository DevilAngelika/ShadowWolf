import {
  AttachmentBuilder,
  ChatInputCommandInteraction,
  Colors,
  GuildMember,
  MessageFlags,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from 'discord.js';
import { config } from '../config';
import { createEmbed } from '../helper/embed';
import { getChannel } from '../helper/channel';
import { createAttachment } from '../helper/attachment';
import path from 'path';

const allowedRoles = [config.acl.admin, config.acl.streaming];

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
    if (interaction.member instanceof GuildMember) {
      if (!interaction.member.roles.cache.some((role) => allowedRoles.includes(role.id))) {
        console.error(`User ${interaction.member.user.username} should not use /live command!`);
        return interaction.reply({
          content: `🚫 Vous ne pouvez pas exécuter la commande suivante. Si vous pensez que c'est une erreur, merci d'ouvrir un ticket.`,
          flags: MessageFlags.Ephemeral,
        });
      }
    }

    try {
      const streaming = interaction.options.getString('stream');

      let description: string = '';

      let imageName: string | null = null;

      const baseDescription: string = `est en live !!!
      
      Venez la rejoindre et la suivre dans ses aventures:
      `;
      const title: string = `C'est l'heure du live`;

      switch (streaming) {
        case 'devilangelika':
          description = `𝒟𝑒𝓋𝒾𝓁♡𝒜𝓃𝑔𝑒𝓁𝒾𝓀𝒶 ${baseDescription} 
          https://www.twitch.tv/devilangelika `;
          break;
        case 'mi':
          description = `Salut toi ! 
          
          Je t'invite à venir me faire un petit coucou sur mon live juste ici !
          Au plaisir de t'y voir !!
          
          https://www.twitch.tv/miission2567
          `;
          imageName = 'mi-live.png';
          break;
        case 'mi-devil':
          description = `Mi et 𝒟𝑒𝓋𝒾𝓁♡𝒜𝓃𝑔𝑒𝓁𝒾𝓀𝒶 sont en live toutes les deux !! 
          
          Venez suivre leur aventure sur leur deux lives :
          https://www.twitch.tv/miission2567 et https://www.twitch.tv/devilangelika`;
          break;
      }

      const embed = createEmbed(title, description, Colors.Purple, imageName);
      let attachment: Array<AttachmentBuilder> | undefined = undefined;

      if (imageName) {
        const imagePath = path.join(process.cwd(), 'images', 'live', imageName);
        attachment = [createAttachment(imagePath, imageName)];
      }

      const channel = getChannel(interaction, config.channels.liveId);

      if (!channel.isSendable()) {
        throw new Error(`Channel ${config.channels.liveId} was not found`);
      }

      return await channel.send({ embeds: [embed], files: attachment });
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
