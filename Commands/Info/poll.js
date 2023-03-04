const {EmbedBuilder, SlashCommandBuilder,PermissionFlagsBits, ChannelType} = require('discord.js')

module.exports = {
    data:new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Crea una encuesta')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option=>
        option.setName('description')
        .setDescription('Mensaje de la encuesta')
        .setRequired(true)
    )
    .addChannelOption(option=>
        option.setName('channel')
        .setDescription('A donde quieres que se envie la Encuesta')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    ),

    async execute(interaction){
        const {options} = interaction
        const channel = options.getChannel('channel')
        const descripcion = options.getString('description')
        const embed = new EmbedBuilder()
        .setColor('Random')
        .setDescription(descripcion)
        .setTimestamp()
        try {
            const m =await channel.send({embeds:[embed]})
            await m.react('✅')
            await m.react('❌')
            await interaction.reply({content:"La Encuesta fue enviada correctamente", ephemeral:true})
        } catch (error) {
            console.log(error);
        }
    }
};
