# Slash Commands handler in Discord.js

*Note: You should know discord.js library and JavaScript itself before playing with slash commands. I highly suggest looking [there](https://discordjs.guide) for discord.js guide and [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript) for JavaScript guide.*

First of all, you should know basic idea of what slash command is and how to use it. I suggest looking [here](https://gist.github.com/advaith1/287e69c3347ef5165c0dbde00aa305d2). Everything there is nicely explained, so you can understand what you will be doing soon.
With this in mind, let's start making handler and first slash command with it.

## Setting up slash command

First, we need to register slash command, so we can use it. In this guide I will use server-specific command, since it deploys instantly.

```javascript
client.api.applications(client.user.id).guilds('<your guild ID>').commands.post({data: {
    name: 'dm',
    description: 'Test command, will DM user'
}});
```
Now, since we have command, we can begin making handler. First, create a folder called `slash-commands`<br>

## Creating handler

*Note: You can name folder whatever you want it to be called. Keep in mind that you have to edit file locations in code.*

Now, on very top of your code, you need to import library `fs`.

```javascript
const fs = require('fs');
```
<br>Now we need to create Discord Collection to hold content of command files<br>
```javascript
client.slashCommands = new Discord.Collection();
```
<br>Having this, now we need to specify where our files are located at and get them.
```javascript
const sFiles = fs.readdirSync('./slash_commands').filter(file => file.endsWith('.js'));
```
<br>What happens here is basically reading directory `slash_commands` and getting only files that end with `.js`.

Now, all that needs to be done is reading every of selected files and putting them to collection we made before. To do this, we need to loop trough each file and put content into Collection.
```javascript
for(const file of sFiles) {
    const command = require(`./slash_commands/${file}`);

    client.slashCommands.set(command.name, command);
}
```
<br>Here name of command is `key` and file content is `value`. Now we are ready to execute command on call. To do this, we need to add one more thing.
```javascript
client.ws.on('INTERACTION_CREATE', async interaction => {
    const commandName = interaction.data.name;
    const command = client.slashCommands.get(commandName);

    try {
        command.execute(interaction, client);
    }catch(error) {
        console.log(error);
    }
});
```
<br>Here, every time new interaction is created (basically when slash command is used), we define a name of command used (`interaction.data.name`) and get command by name (remember that name of command is always key in our collection). Then we execute command, passing `interaction` and `client`. I used `try catch` to prevent from bot crashing.

## Creating actual command
At this point we are ready to create command. It's very simple if you play with it for some time. Command we will make here will send respond on a private chat.
Keep in mind that when registering command, we called it `dm` (`name: 'dm'`) and key in command collection is always it's `name` parameter (you will understand it in second). With that in mind, let's make file called `dm` in `slash_commands` folder.
<br><br>*Note: you can name command file as you want, but it's good to name files in handler with name of command they represent.*

<br>In `dm.js` file, code for response looks like this:
```javascript
const Discord = require('discord.js');

module.exports = {
    name: 'dm',
    execute(interaction, client) {
        const guild = client.guilds.cache.get(interaction.guild_id);
        const member = guild.members.cache.get(interaction.member.user.id);

        const embed = new Discord.MessageEmbed()
                                .setAuthor(`${member.user.username}#${member.user.discriminator}`, member.user.displayAvatarURL())
                                .setDescription(`You did it!`)
                                .setColor('2F3136')
                                .setTimestamp();

        return member.send(embed);
    }
}
```
<br>If you were reading `discordjs.guide`, you probably notice that it's similar. You are not wrong. It's basically same thing with different parameters. Instead of `message`, we have `interaction` and `client`. With these 2 parameters we can access guild, find member that invoke command and do stuff.
Now I will explain code. First, we import `discord.js` library, so we can create an embed.  Then, inside `module.exports`, we set name as `dm` (that's key in commands collection, and it needs to be same as name of command you registered). Then, inside of `execute(interaction, client)` we get member that invoke command by their ID.
Having member defined, we make new embed. In `author` field of embed, we put an avatar/profile picture of a member, and their discord username with tag. As description, we set `You did it!`. We set it's color to embed background color and set timestap. After this, we send this embed to member.

## End
Now, we made slash command handler! I'd highly appreciate feedback. In case you have issues with code, I put template with whole code in same repository, so you can check it out and compare. Thanks for reading it and I wish you good luck!
