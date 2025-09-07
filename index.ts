import {
  Interaction,
  MessageFlags,
  Client,
  GatewayIntentBits,
  Collection,
  REST,
  Routes,
} from 'discord.js';
import { sendButtons } from './integrations/primary';
import { closeTicket, createTicket } from './helper/ticket';
import { config } from './config';
import express, { Request, Response } from 'express';
import { readdirSync } from 'fs';
import path from 'path';

const client: any = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection<string, any>();
const commands: any[] = [];

const commandsPath = path.join(__dirname, 'commands');

async function loadCommands(dir: string) {
  const files = readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(dir, file.name);

    if (file.name.endsWith('.ts') || file.name.endsWith('.js')) {
      const cmdModule = await import(filePath);
      const command = cmdModule.default;
      if (command && command.data && command.execute) {
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
        console.log(`✅ Loaded command: ${command.data.name}`);
      }
    }
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

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
      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({
          content: '❌ Une erreur est survenue.',
          flags: MessageFlags.Ephemeral,
        });
      } else {
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

(async () => {
  await loadCommands(commandsPath);

  try {
    console.log('⏳ Refreshing application commands...');
    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!), {
      body: commands,
    });
    console.log('✅ Commands registered!');

    client.login(process.env.DISCORD_TOKEN);
  } catch (err) {
    console.error(err);
  }
})();

const appExpress = express();
const port: Number = 3000;

appExpress.get('/', (req: Request, res: Response) => {
  res.send(`${config.names.shadowwolf} est toujours debout`);
});

appExpress.listen(port, () => {
  console.log(`${config.names.shadowwolf} se reveille`);
});
