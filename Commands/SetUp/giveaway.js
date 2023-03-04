const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js')
const ms = require('ms')
const client = require('../../index')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Sistema de Sorteos completo')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand.setName('start')
                .setDescription('Empieza el Sorteo')
                .addStringOption(option =>
                    option.setName('length')
                        .setDescription('Enter the length of the giveaway')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('prize')
                        .setDescription('Set a prize to win')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('winners')
                        .setDescription('Enter the numbers of winners(dafault is 1)')
                        .setRequired(true)
                )
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('Specifica el canal')
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('pause')
                .setDescription('pausa el Sorteo')
                .addStringOption(option =>
                    option.setName('message-id')
                        .setDescription('Especifica el id del mensaje del giveaway')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('unpause')
                .setDescription('pausa el Sorteo')
                .addStringOption(option =>
                    option.setName('message-id')
                        .setDescription('Especifica el id del mensaje del giveaway')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('end')
                .setDescription('Acaba el sorteo')
                .addStringOption(option =>
                    option.setName('message-id')
                        .setDescription('Especifica el id del mensaje del giveaway')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('reroll')
                .setDescription('Selecciona un nuevo ganador')
                .addStringOption(option =>
                    option.setName('message-id')
                        .setDescription('Especifica el id del mensaje del giveaway')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('delete')
                .setDescription('elimina el Sorteo')
                .addStringOption(option =>
                    option.setName('message-id')
                        .setDescription('Especifica el id del mensaje del giveaway')
                        .setRequired(true)
                )
        ),

    async execute(interaction) {

        const { options,channel,guildId } = interaction
        const sub = options.getSubcommand()
        const errEmbed = new EmbedBuilder()
            .setColor('Red')
        const succesEmbed = new EmbedBuilder()
            .setColor('Random')
        if (sub === 'start') {
            const gchannel = options.getChannel('channel') || channel
            const duration = ms(options.getString('length'))
            const winnerCount = options.getInteger('winners') || 1
            const prize = options.getString('prize')

            if (isNaN(duration)) {
                errEmbed.setDescription('Ingresa la correcta duracion 1d,1h,1m,1s')
                return interaction.reply({ embeds: [errEmbed] })
            }

            return client.giveawaysManager.start(gchannel, {
                duration: duration,
                winnerCount,
                prize,
                messages: client.giveawayConfig.messages
            }).then(async () => {
                if (client.giveawayConfig.giveawayManager.everyoneMention) {
                    const msg = await gchannel.send('@everyone')
                    msg.delete()
                }
                succesEmbed.setDescription(`Giveaway starter in ${gchannel}`)
                return interaction.reply({ embeds: [succesEmbed], ephemeral: true })
            }).catch((error) => {
                console.log(error)
                errEmbed.setDescription(`Error \n\`${error}\``)
                return interaction.reply({ embeds: [errEmbed], ephemeral: true })
            })
        }

        const messageid = options.getString('message-id')
        const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === guildId && messageid)

        if (!giveaway) {
            errEmbed.setDescription(`Giveaway whit ID ${messageid} was not found in the database!`)
            return interaction.reply({ embeds: [errEmbed], ephemeral: true })
        }

        if(sub === 'pause'){
            if(giveaway.isPaused){
                errEmbed.setDescription('This giveaway is already')
                return interaction.reply({ embeds: [errEmbed], ephemeral: true })
            }
            await client.giveawaysManager.pause(messageid,{
                content: client.giveawayConfig.messages.paused,
                infinityDurationText: client.giveawayConfig.messages.infinityDurationText,
            }).then(()=>{
                succesEmbed.setDescription('Se ha pausado')
                return interaction.reply({embeds:[succesEmbed], ephemeral:true})
            }).catch((error)=>{
                console.log(error);
                errEmbed.setDescription(`Error \n\`${error}\``)
                return interaction.reply({embeds:[errEmbed], ephemeral:true})
            })
        }

        if(sub === 'unpause'){
            client.giveawaysManager.unpause(messageid).then(()=>{
                succesEmbed.setDescription('Se ha unpausado')
                return interaction.reply({embeds:[succesEmbed], ephemeral:true})
            }).catch((error)=>{
                console.log(error);
                errEmbed.setDescription(`Error \n\`${error}\``)
                return interaction.reply({embeds:[errEmbed], ephemeral:true})
            })
        }

        if(sub === 'end'){
            client.giveawaysManager.end(messageid).then(()=>{
                succesEmbed.setDescription('Se ha terminado')
                return interaction.reply({embeds:[succesEmbed], ephemeral:true})
            }).catch((error)=>{
                console.log(error);
                errEmbed.setDescription(`Error \n\`${error}\``)
                return interaction.reply({embeds:[errEmbed], ephemeral:true})
            })
        }

        if(sub === 'reroll'){
            await client.giveawaysManager.reroll(messageid,{
                messages:{
                    congrat: client.giveawayConfig.messages.congrat,
                    error:client.giveawayConfig.messages.error
                }
            }).then(()=>{
                succesEmbed.setDescription('Tiene un nuevo ganador')
                return interaction.reply({embeds:[succesEmbed], ephemeral:true})
            }).catch((error)=>{
                console.log(error);
                errEmbed.setDescription(`Error \n\`${error}\``)
                return interaction.reply({embeds:[errEmbed], ephemeral:true})
            })
        }

        if(sub === 'delete'){
            await client.giveawaysManager.delete(messageid).then(()=>{
                succesEmbed.setDescription('Tiene un nuevo ganador')
                return interaction.reply({embeds:[succesEmbed], ephemeral:true})
            }).catch((error)=>{
                console.log(error);
                errEmbed.setDescription(`Error \n\`${error}\``)
                return interaction.reply({embeds:[errEmbed], ephemeral:true})
            })
        }
    },
};
