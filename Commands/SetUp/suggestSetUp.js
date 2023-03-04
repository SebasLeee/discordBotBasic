const {SlashCommandBuilder,EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js')
const suggestSchema = require('../../Models/suggest')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('suggestsetup')
    .setDescription('Crea un canal para las suguerencias')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option=>
        option.setName('channel')
        .setDescription('Elige el canal')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),

    async execute(interaction){
        const {channel,options} = interaction
        const suggestChannel = options.getChannel('channel')

        if(!interaction.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages)){
            interaction.reply({content:"No tengo permisos para realizar esta accion"})
        }

        suggestSchema.findOne({Guild:interaction.guild.id}, async(err, data)=>{
            if(!data){
                const suggestCreate = await suggestSchema.create({
                    Guild:interaction.guild.id,
                    Channel:suggestChannel.id
                })
            }

            return interaction.reply({content:"Se ha creado exitosamente el canal de suguerencias", ephemeral:true})
        })
    }

};
