const {SlashCommandBuilder,EmbedBuilder, PermissionFlagsBits, ChannelType} = require('discord.js')
const logSchema = require('../../Models/Logs')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('logssetup')
    .setDescription('Setup a logs')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option =>
        option.setName('channel')
        .setDescription('Choose a channel')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),

    async execute(interaction){
        const {channel, guildId, options} = interaction
        const logChannel = options.getChannel('channel')
        const embed = new EmbedBuilder()

        logSchema.findOne({Guild:guildId}, async (err, data)=>{
            if(!data){
                await logSchema.create({
                    Guild:guildId,
                    Channel:logChannel.id
                })

                embed.setDescription('Data se ha creado ')
                .setColor('Green')
                .setTimestamp()
            }else if(data){
                logSchema.deleteOne({Guild:guildId})
                await logSchema.create({
                    Guild:guildId,
                    Channel:logChannel.id,
                })
                embed.setDescription('Data se ha reemplazado con la anterior ')
                .setColor('Green')
                .setTimestamp()
            }

            if(err){
                embed.setDescription('Ha ocurrido un error porfavor contacte a los desarolladores')
                .setColor('Red')
                .setTimestamp()
            }

            return interaction.reply({embeds:[embed], ephemeral:true})
        })
    }
};
