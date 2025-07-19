const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});



client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);

    const channel = client.channels.cache.get('1354022484533317666');
  if (channel) {
    channel.send('Bonjour !');
  } else {
    console.error('Channel not found!');
  }
});

client.login(process.env.DISCORD_TOKEN);