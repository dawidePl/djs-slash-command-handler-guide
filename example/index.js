const Discord = require('discord.js');
const fs = require('fs');

const client = new Discord.Client();

client.slashCommands = new Discord.Collection();

const sFiles = fs.readdirSync('./slash_commands').filter(file => file.endsWith('.js'));

for(const file of sFiles) {
    const command = require(`./slash_commands/${file}`);

    client.slashCommands.set(command.name, command);
}

client.once('ready', () => {
    client.api.applications(client.user.id).guilds('<guild ID>').commands.post({data: {
        name: 'dm',
        description: 'Test command, will DM user'
    }});

    client.ws.on('INTERACTION_CREATE', async interaction => {
        const commandName = interaction.data.name;
        const command = client.slashCommands.get(commandName);

        try {
            command.execute(interaction, client);
        }catch(error) {
            console.log(error);
        }
    });
});

client.login('<your bot token here>');
