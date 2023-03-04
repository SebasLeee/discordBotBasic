const {EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('createverify')
    .setDescription('Set your verification channel')
    .addChannelOption(option =>
        option.setName('channel')
        .setDescription('Send verification embed in this channel')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction){
        const channel = interaction.options.getChannel('channel');
        const verifyEmbed = new EmbedBuilder()
        .setTitle("**LEE'S DEVELOPMENT**")
        .setDescription(":flag_us: **Verification** ```\nWelcome to Lee's Development\nTo verify, please react to this message with the flag of your country.\n```\n:flag_es: **Verificacion**\n```\nBienvenido a Lee's Development!\nPara verificarte reacciona a este mensaje con la bandera de tu pais.\n```")
        .setColor(0x5fb041)
        let sendChannel= channel.send({
            embeds:([verifyEmbed]),
            components:[
                new ActionRowBuilder().setComponents(
                    new ButtonBuilder().setCustomId('verifyesp').setLabel('Español').setStyle(ButtonStyle.Success).setEmoji('🇪🇸'),
                    new ButtonBuilder().setCustomId('verifyen').setLabel('English').setStyle(ButtonStyle.Danger).setEmoji('🇺🇸')
                ),
            ],
        });
        if(!sendChannel){
            return interaction.reply({content:'There was an error! Try Againg later', ephemeral:true})
        }else{
            return interaction.reply({content:'Verification channel was sucefully set!', ephemeral:true})
        }
    }
};
