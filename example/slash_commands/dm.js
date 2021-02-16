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
