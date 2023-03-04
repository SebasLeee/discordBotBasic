const {ButtonInteraction, EmbedBuilder, PermissionFlagsBits} = require('discord.js')
const {createTranscript} = require('discord-html-transcripts')
const TicketSetup = require('../../Models/TicketSetup')
const ticketSchema = require("../../Models/Ticket")

module.exports = {
    name:"interactionCreate",
    async execute(interacion){
        const {guild, member, customId, channel} = interacion
        const {ManageChannels, SendMessages} = PermissionFlagsBits

        if(!interacion.isButton()) return;

        if(!["close", "lock", "unlock","claim"].includes(customId)) return;

        const docs = await TicketSetup.findOne({GuildID:guild.id})
        
        if(!docs) return;

        if(!guild.members.me.permissions.has((r)=> r.id === docs.Handlers))
            return interacion.reply({content:"No tengo permisos para esto", ephemeral: true})
        const embed = new EmbedBuilder().setColor("Aqua");
        ticketSchema.findOne({ChannelID: channel.id}, async(err, data)=>{
            if(err)throw err;
            if(!data) return;

            const fetchedMember = await guild.members.cache.get(data.MembersID);

            switch(customId){
                case "close":
                    if(!member.permissions.has(ManageChannels))
                        return interacion.reply({content:"No tienes permisos para eso", ephemeral:true})
                    if(data.closed == true)
                        return interacion.reply({content:"El ticket se esta eliminando...", ephemeral:true})
                    const transcript = await createTranscript(channel,{
                        limit:-1,
                        returnBuffer:false,
                        fileName:`${member.user.username}-ticket${data.Type}-${data.ticketID}.html`,
                    })
                    await ticketSchema.updateOne({ChannelID:channel.id},{Open:false}, {Closed:false});
                    const transcriptEmbed = new EmbedBuilder()
                    .setTitle(`${guild.name}`)
                    .setFooter({text:member.user.tag, iconURL: member.displayAvatarURL({dynamic:true})})
                    .setTimestamp();
                    const transcriptProcess = new EmbedBuilder()
                    .setTitle(`Guardando transcript..`)
                    .setDescription(`Ticket will be closed in 10s`)
                    .setColor("Red")
                    .setFooter({text:member.user.tag, iconURL:member.displayAvatarURL({dynamic:true})})
                    .setTimestamp()
                    const res = await guild.channels.cache.get(docs.Transcripts).send({
                        embeds:[transcriptEmbed],
                        files:[transcript],
                    })

                    channel.send({embeds:[transcriptProcess]})
                    setTimeout(function(){
                        member.send({
                            embeds:[transcriptEmbed.setDescription(`Se ha cerrado el ticket de ${data.OpenBy}`)]
                        }).catch(()=> console.log('Couldn\t`send transcript to direct messages'))
                        channel.delete()
                    }, 1000);
                    break;

                case "lock":
                    if(!member.permissions.has(ManageChannels))
                        return interacion.reply({content:"No tienes permisos para eso", ephemeral:true})
                    if(data.Locked == true)
                        return interacion.reply({content:"Ticket se bloqueo", ephemeral:true})
                    await ticketSchema.updateOne({ChannelID: channel.id}, {Locked:true});
                    embed.setDescription("Ticket se bloqueo")
                    data.MembersID.forEach((m)=>{
                        channel.permissionOverwrites.edit(m, {SendMessages:false})
                    })
                    return interacion.reply({embeds:[embed]})
            
                case "unlock":
                    if(!member.permissions.has(ManageChannels))
                        return interacion.reply({content:"No tienes permisos para eso", ephemeral:true})
                    if(data.Locked == false)
                        return interacion.reply({content:"Ticket se desbloqueo", ephemeral:true})
                    await ticketSchema.updateOne({ChannelID: channel.id}, {Locked:false});
                    embed.setDescription("Ticket se abrio correctamente");
                    data.MembersID.forEach((m)=>{
                        channel.permissionOverwrites.edit(m, {SendMessages:true})
                    })
                    return interacion.reply({embeds:[embed]})
                case "claim":
                    if(!member.permissions.has(ManageChannels))
                        return interacion.reply({content:"No tienes permiso para esto", ephemeral:true})
                    if(data.Claimed == true)
                        return interacion.reply({content:`Ticket is already claimed By <@${data.ClaimedBy}>`, ephemeral:true})
                    await ticketSchema.updateOne({ChannelID:channel.id},{Claimed:true, ClaimedBy:member.id})

                    embed.setDescription(`Bienvenido ${data.OpenBy} a HazelMC Network. ¿En qué podemos ayudarte?\nTicket was sucefully claimed by ${member}`)

                    interacion.reply({embeds:[embed]})
                    break; 
            }
        })
    }
};
