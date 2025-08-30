import { Interaction, MessageFlags, Client, GatewayIntentBits } from 'discord.js';
import { sendButtons } from './integrations/primary';
import { closeTicket, createTicket } from './helper/ticket';
import { config } from './config';
import express, { Request, Response } from 'express';

const client: any = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', async (): Promise<void> => {
  console.log(`Logged in as ${client.user.tag}`);

  const channel = client.channels.cache.get(config.channels.defaultTchatting);
  if (channel) {
    console.log('Bonjour !');
  } else {
    console.error('Channel not found!');
  }

  await sendButtons(client);
});

client.on('interactionCreate', async (interaction: Interaction): Promise<void> => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) {
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Erreur during command's execution ${interaction.commandName} :`, error);
      if (!interaction.replied) {
        await interaction.reply({
          content: '❌ Une erreur est survenue.',
          flags: MessageFlags.Ephemeral,
        });
      }
    }
    return;
  }

  if (!interaction.isButton()) {
    return;
  }

  switch (interaction.customId) {
    case 'close':
      await closeTicket(interaction);
      break;
    case 'complaint':
      await createTicket('plainte-', interaction);
      break;
    case 'new-member':
      await createTicket('membre-', interaction);
      break;
    case 'other':
      await createTicket('autre-', interaction);
      break;
    case 'suggest':
      await createTicket('suggestion-', interaction);
      break;
    default:
      await interaction.reply({
        content: `Bouton ${interaction.customId} non pris en compte actuellement. Merci de contacter ${config.names.devilangelika}`,
        flags: MessageFlags.Ephemeral,
      });
  }
});

client.login(process.env.DISCORD_TOKEN);

const appExpress = express();
const port: Number = 3000;

appExpress.get('/', (req: Request, res: Response) => {
  res.send(`${config.names.shadowwolf} est toujours debout`);
});

appExpress.listen(port, () => {
  console.log(`${config.names.shadowwolf} se reveille`);
});
