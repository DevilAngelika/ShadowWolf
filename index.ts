import { Interaction, MessageFlags } from "discord.js";
import { sendButtons } from "./integrations/primary";
import { createTicket } from "./helper/ticket";

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);

  const channel = client.channels.cache.get('1354022484533317666');
  if (channel) {
    console.log('Bonjour !');
  } else {
    console.error('Channel not found!');
  }

  sendButtons(client); 
});

client.on('interactionCreate', async (interaction: Interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command){
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Erreur during command's execution ${interaction.commandName} :`, error);
      if (!interaction.replied) {
        await interaction.reply({ content: "❌ Une erreur est survenue.", flags: MessageFlags.Ephemeral });
      }
    }
    return;
  }


  if (!interaction.isButton()){
    return;
  }

  switch(interaction.customId) {
    case 'complaint': 
      await createTicket('plainte-', interaction);
      break;
    case 'new-membre': 
      await createTicket('membre-', interaction);
      break;
    case 'other': 
      await createTicket('autre-', interaction);
      break;
    case 'suggest':
      await createTicket('suggestion-', interaction);
      break;
    default:
      return await interaction.reply({ content: `Bouton ${interaction.customId} non pris en compte actuellement. Merci de contacter 𝒟𝑒𝓋𝒾𝓁♡𝒜𝓃𝑔𝑒𝓁𝒾𝓀𝒶`, flags: MessageFlags.Ephemeral });
  }
})

client.login(process.env.DISCORD_TOKEN);