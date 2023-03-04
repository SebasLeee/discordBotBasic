const {SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType} = require('discord.js')
const logSchema = require('../../Models/Logs')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('setup-logs')
    .setDescription('Crea un canal de logs del auditorio de logs')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option =>
        option.setName('channel')
        .setDescription('Canal para los logs')
        .setRequired(false)
    ),

    async execute(interaction){
        const {channel, guildId, options} = interaction
        const logChannel = options.getChannel('channel') || channel;
        const embed = new EmbedBuilder()

        logSchema.findOne({Guild:guildId}, async (err, data)=>{
            if(!data){
                await logSchema.create({
                    Guild:guildId,
                    Channel:logChannel.id
                })

                embed.setDescription(`Data se envio correctamente a la base de datos`)
                .setColor('Random')
                .setTimestamp()
                
            }else if(data){
                logSchema.findOneAndDelete({Guild:guildId})
                await logSchema.create({
                    Guild:guildId,
                    Channel:logChannel.id
                })

                embed.setDescription(`La antigua data fue correctamente reemplazada con la nueva data`)
                .setColor('Random')
                .setTimestamp()
            }
            if(err){
                embed.setDescription(`Ah ocurrido un error porfavor contacte con los desarolladores `)
                .setColor('Red')
                .setTimestamp()
            }

            return interaction.reply({embeds:[embed], ephemeral:true })
        })
    }
};
