const { CommandInteraction, EmbedBuilder} = require('discord.js')

module.exports = {
  name:"interactionCreate",

  async execute(interaction,client){
    const {customId, values, guild, member} = interaction;

    if(interaction.isChatInputCommand()){
      const command = client.commands.get(interaction.commandName)
      if(!command){
        return interaction.reply({content:"Comando Deshabilitado"})
      }
      command.execute(interaction,client)
    }else if(interaction.isButton()){
      if(customId === "verifyen"){
        const roleEn = interaction.guild.roles.cache.get('1071114033610113186') // Rol de Ingles
        const noVerified = interaction.guild.roles.cache.get('1070495744676610058') // Rol de NoVerificado
        return interaction.member.roles.add(roleEn),interaction.member.roles.remove(noVerified).then((member)=> interaction.reply({content:`${roleEn} Successfully assigned, you can now interact with the server.`, ephemeral:true}))
      }
      if(customId === 'verifyesp'){
        const roleEsp = interaction.guild.roles.cache.get('1071113989821562930') // Rol de Ingles
        const noVerified = interaction.guild.roles.cache.get('1070495744676610058') // Rol de NoVerificado
        return interaction.member.roles.add(roleEsp),interaction.member.roles.remove(noVerified).then((member)=> interaction.reply({content:`${roleEsp} Successfully assigned, you can now interact with the server.`, ephemeral:true}))
      }
    }else if(interaction.isSelectMenu()){
      if(customId === 'help-menu') return console.log("pépe");;
      if(customId === 'reaction-roles'){
        console.log("pep1");
        for (let i=0;i<values.length;i++){
          const roleId = values[i]

          const role= guild.roles.cache.get(roleId)
          const hastRole = member.roles.cache.has(roleId)

          switch(hastRole){
            case true:
              member.roles.remove(roleId)
              break;
            case false:
              member.roles.add(roleId)
              break;
          }
        }
        if(values.length == 0)
          return interaction.deferUpdate()
        interaction.reply({content:`Roles actualizados`, ephemeral:true})
      }
    }else if(interaction.isModalSubmit()){
      if(customId === 'announce'){
        const tituloEspañol = interaction.fields.getTextInputValue('espTitle')
        const  descripcionEspañol = interaction.fields.getTextInputValue('espDescription')
        const tituloIngles = interaction.fields.getTextInputValue('enTitle')
        const descripcionIngles = interaction.fields.getTextInputValue('enDescription')
        const embed = new EmbedBuilder()
        .setTitle(`**${guild.name}**`)
        .setDescription(`:flag_esp:`)
        await guild.channels.cache.get('1069347582280732702').send({embeds:[embed]})
        interaction.reply({content:"Se ha enviado correctamente", ephemeral:true})
      }
    }
  },
};
