const { Message, Client, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const  welcomeSchema = require("../../Models/welcome")
const { model, Schema} = require('mongoose')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("setup-welcome")
    .setDescription("Set Up your welcome message for the discord bot")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option =>
        option.setName("channel")    
        .setDescription("Channel for the welcome messages")
        .setRequired(true)
    )
    .addStringOption(option =>
        option.setName("welcome-message")
        .setDescription("Enter welcome message")
        .setRequired(true)
    )
    .addRoleOption(option=>
        option.setName("welcome-role")
        .setDescription("Enter your welcome role")
        .setRequired(false)
    ),
    async execute(interaction){
        const {channel,options} = interaction;
        const welcomeChannel = options.getChannel("channel")
        const welcomeMessage = options.getString("welcome-message")
        const roleId = options.getRole("welcome-role")

        if(!interaction.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages)){
            interaction.reply({content:"No tengo permisos para esto", ephemeral:true})
        }
        welcomeSchema.findOne({Guild: interaction.guild.id}, async (err,data) =>{
            if(!data){
                const newWelcome = await welcomeSchema.create({
                    Guild: interaction.guild.id,
                    Channel:welcomeChannel.id,
                    Msg: welcomeMessage,
                    Role:roleId.id
                })
            }
            interaction.reply({content:"Exitosamente creado el mensaje de bienvenida", ephemeral:true})
        })
    }
};


