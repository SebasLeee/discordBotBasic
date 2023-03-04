const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')
const Schema = require('../../Models/suggest')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('suggest')
    .setDescription('Suggest something.')
    .addStringOption(option =>
        option.setName('name')
        .setDescription('Titulo de la Suguerencia')
        .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('descripcion')
        .setDescription('Describe tu sugerencia')
        .setRequired(true)
    ),

    async execute(interacion){
        
        Schema.findOne({Guild:interacion.guild.id}, async(err, data)=>{
            if(!data) return;
            const {guild, options} = interacion
            const descripcion = options.getString('descripcion')
            const name = options.getString('name')
            const suggestChannel = guild.channels.cache.get(data.Channel)
            const suggestEmbed = new EmbedBuilder()
            .setColor('Random')
            .setDescription(`La suguerencia fue hecha por${interacion.user}`)
            .addFields({name:"Sugerencia", value:`${name}`},{name:'Descripcion', value:`${descripcion}`})
            .setFooter({text:interacion.user.tag, iconURL:interacion.user.displayAvatarURL({dynamic:true})})
            .setTimestamp()

            suggestChannel.send({embeds:[suggestEmbed]})
        })

        return interacion.reply({content:"Se envio correctamente", ephemeral: true})
    }
};
