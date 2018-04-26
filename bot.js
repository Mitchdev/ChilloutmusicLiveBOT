const Discord = require('discord.js');
const client = new Discord.Client();
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({game: { name: 'Jon Kuwada	- Cherry Cola' }, status: 'idle' }).then(console.log).catch(console.error);
});

client.on('message', message => {
    if (message.content == '!ping') {
    	message.reply('pong!');
  	}
});

client.login(process.env.BOT_TOKEN);
