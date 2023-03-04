const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')
const Levels = require('discord.js-leveling')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('levelinfo')
    .setDescription('See hoy much xp a level takes to reach.')
    .addIntegerOption(option =>
        option.setName('level')
        .setDescription('The amount of xp required')
        .setRequired(true)
    ),
    async execute(interaction) {
        const {options} = interaction;
        const level = options.getInteger('level');
        const xpAmmount = Levels.xpFor(level)

        interaction.reply({content:`You need ${xpAmmount} more xp to reach level ${level}`, ephemeral:true})
    }
};
