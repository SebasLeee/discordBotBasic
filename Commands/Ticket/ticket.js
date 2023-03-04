const {SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder} = require('discord.js')
const ticketSchema = require("../../Models/Ticket")

module.exports = {
    data:new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Ticket Actions")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addStringOption(option =>
        option
        .setName("action")
        .setDescription("Add o remove members from the ticket")
        .setRequired(true)
        .addChoices(
            {name:"Add",value:"add"},
            {name:"Remove", value:"remove"}
        )
    )
    .addUserOption(option=>
        option.setName("member")
        .setDescription("Selecciona el miembro del discord")
        .setRequired(true)
    ),
    async execute(interacion){
        const {guildId, options, channel} = interacion

        const action=options.getString("action")
        const member=options.getUser("member")

        const embed = new EmbedBuilder()

        switch(action){
            case "add":
                ticketSchema.findOne({GuildID: guildId,ChannelID:channel.id}, async(err, data)=>{
                    if(err) throw (err)
                    if(!data)
                        return interacion.reply({embeds:[embed.setColor("Red").setDescription("Ah ocurrido un error intentarlo mas tarde")], ephemeral:true})
                    if(data.MembersID.includes(member.id))
                        return interacion.reply({embeds:[embed.setColor("Red").setDescription("Ah ocurrido un error intentarlo mas tarde")], ephemeral:true})
                    data.MembersID.push(member.id)
                    channel.permissionOverwrites.edit(member.id,{
                        SendMessages:true,
                        ViewChannel: true,
                        ReadMessageHistory:true,
                    })

                    interacion.reply({embeds:[embed.setColor("Green").setDescription(`${member} se agrego al ticket`)], ephemeral:true})
                    data.save()
                })
                break;
            case "remove":
                ticketSchema.findOne({GuildID: guildId,ChannelID:channel.id}, async(err, data)=>{
                    if(err) throw (err)
                    if(!data)
                        return interacion.reply({embeds:[embed.setColor("Red").setDescription("Ah ocurrido un error intentarlo mas tarde")], ephemeral:true})
                    if(!data.MembersID.includes(member.id))
                        return interacion.reply({embeds:[embed.setColor("Red").setDescription("Ah ocurrido un error intentarlo mas tarde")], ephemeral:true})
                    data.MembersID.remove(member.id)
                    channel.permissionOverwrites.edit(member.id,{
                        SendMessages:false,
                        ViewChannel: false,
                        ReadMessageHistory:false,
                    })

                    interacion.reply({embeds:[embed.setColor("Green").setDescription(`${member} se elimino del ticket`)], ephemeral:true})
                    data.save()
                })
                break;
        }
    }
};
