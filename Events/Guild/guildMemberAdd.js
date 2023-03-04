const { EmbedBuilder } = require("@discordjs/builders");
const {GuildMember, Embed, InteractionCollector} = require("discord.js");
const  Schema = require('../../Models/welcome')

module.exports = {
  name:"guildMemberAdd",
  async execute(member){
    Schema.findOne({Guild: member.guild.id}, async(err,data)=>{
      if(!data) return;
      let channel = data.Channel;
      let Msg = data.Msg || " ";
      let Role = data.Role;

      const {user, guild} = member;
      const welcomeChannel = member.guild.channels.cache.get(data.Channel);

      const welcomeEmbed = new EmbedBuilder()
      .setTitle(`**Bienvenido a ${guild.name}** :partying_face:`)
      .setAuthor({name:`${member.user.tag}`, iconURL:member.user.avatarURL({dynamic:true})})
      .setDescription(`Recuerda no ser toxico, y respetar a todos, pasate por:\n\n<#1066911454403502193> Para poder recibir soporte\n\nContigo somos ${guild.memberCount}`)
      .setThumbnail(member.user.avatarURL({dynamic:true, format:"png"}))
      .setImage('https://images-ext-2.discordapp.net/external/RMlEY-DkUWdR32Ds1sQ6xkdo5JL6sQ6KYxOp_BzBmnc/https/i.pinimg.com/originals/a5/90/80/a59080879f58308686eb0457e78574ce.gif?width=400&height=225')
      .setColor(0x037821)
      .setFooter({ text: `${guild.name}`, iconURL: `https://media.tenor.com/o0e6lIDmtJAAAAAM/goku-black.gif`})
      .setTimestamp()

      welcomeChannel.send({embeds:[welcomeEmbed]});
      member.roles.add(data.Role)
    })
  }
};  