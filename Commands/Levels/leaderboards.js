const {SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, WebhookClient, EmbedBuilder} = require('discord.js')
const Levels = require('discord.js-leveling')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("leaderboards")
    .setDescription("Obtienes informacion sobre el ranking"),
    async execute(interaction, client){ 

        const {guildId} = interaction;

        const rawLeaderboard = await Levels.fetchLeaderboard(guildId,10)

        if(rawLeaderboard.length < 1) return interaction.reply('Nobodys in the leaderboard');

        const embed = new EmbedBuilder()

        const leaderboard  = await Levels.computeLeaderboard(client, rawLeaderboard, true)

        const lb = leaderboard.map(e => `**${e.position}** ${e.username}#${e.discriminator}\n**Levels**${e.level}\n**XP** ${e.xp.toLocaleString()}  `)

        embed.setTitle('Leaderboards').setDescription(lb.join("\n\n")).setTimestamp()

        return interaction.reply({embeds:[embed]})

        
    }
};



