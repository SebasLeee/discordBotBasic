const {SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, WebhookClient, EmbedBuilder} = require('discord.js')
const Levels = require('discord.js-leveling')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("Obtienes informacion sobre una persona")
    .addUserOption(option=>
        option.setName('user')
        .setDescription('Selecciona el usuario')
    ),
    async execute(interaction){

        const {options, guildId, user} = interaction;

        const member = options.getMember('user') || user;

        const levelUser = await Levels.fetch(member.id, guildId);

        const embed = new EmbedBuilder()

        if(!levelUser) return interaction.reply({content:`Seems like this user not earned any xp`, ephemeral:true})

        embed.setDescription(`**${member.tag}** is currently level ${levelUser.level} and has ${levelUser.xp.toLocaleString()}xp.`).setColor('Random').setTimestamp();
        return interaction.reply({embeds:[embed]})


        



        


        
    }
};
