const {EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, Client, Message, ChannelType} = require('discord.js')
const leaveSchema = require('../../Models/leave')
const {model, Schema} = require('mongoose')

module.exports = {
    data:new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Crea un sistema para cuando salgan del discord')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option=>
        option.setName('channel')
        .setDescription('Elige el canal')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    ),

    async execute(interaction){
        const {channel,options} = interaction
        const leaveChannel = options.getChannel('channel')

        if(!interaction.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages)){
            interaction.reply({content:"No tengo permisos para realizar esta accion"})
        }
        leaveSchema.findOne({Guild: interaction.guild.id}, async (err, data) =>{
            if(!data){
                const newLeave = await leaveSchema.create({
                    Guild: interaction.guild.id,
                    Channel: leaveChannel.id
                })
            }
            return interaction.reply({content:"Se ha creado exitosamente el registro de Salida"})
        })
    }
    
};
