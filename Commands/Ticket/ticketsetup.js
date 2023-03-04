const { Client, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ChannelType } = require('discord.js')
const TicketSetup = require('../../Models/TicketSetup')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ticketsetup")
        .setDescription("Crea el mensaje del ticket")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("Select the channel where ticket should be created")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        )
        .addChannelOption(option =>
            option.setName("category")
                .setDescription("Select the parent of where ticket should be created")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildCategory)
        )
        .addChannelOption(option =>
            option.setName("transcripts")
                .setDescription("Select the channel where the transcripts should be send")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        )
        .addRoleOption(option =>
            option.setName("handlers")
                .setDescription("Select the ticket handlers role")
                .setRequired(true)
        )
        .addRoleOption(option =>
            option.setName("everyone")
                .setDescription("Tag everyone Role")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("description")
                .setDescription("Set the description for the ticket embed")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("firstbutton")
                .setDescription("Format:(Name of button, Emoji)")
                .setRequired(true)
        ),
    async execute(interaction) {
        const { guild, options } = interaction;

        try {
            const channel = options.getChannel("channel")
            const category = options.getChannel("category")
            const transcripts = options.getChannel("transcripts")

            const handlers = options.getRole("handlers")
            const everyone = options.getRole("everyone")

            const description = options.getString("description")
            const firstbutton = options.getString("firstbutton").split(",")

            const emoji1 = firstbutton[1]

            await TicketSetup.findOneAndUpdate({ GuildID: guild.id },
                {
                    Channel: channel.id,
                    Category: category.id,
                    Transcripts: transcripts.id,
                    Handlers: handlers,
                    Everyone: everyone.id,
                    Description: description,
                    Buttons: [firstbutton[0]]
                },
                {
                    new: true,
                    upsert: true,

                }
            );
            const button = new ActionRowBuilder().setComponents(
                new ButtonBuilder().setCustomId(firstbutton[0]).setLabel(firstbutton[0]).setStyle(ButtonStyle.Danger).setEmoji(emoji1),
            );
            
            const embed = new EmbedBuilder()
                .setDescription(description)
                .setTimestamp()

            await guild.channels.cache.get(channel.id).send({
                embeds: ([embed]),
                components: [
                    button
                ]

            })

            interaction.reply({ content: "El mensaje del ticket fue enviado correctamente", ephemeral: true })

        } catch (err) {
            console.log(err);
            const errEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Error")
            return interaction.reply({ embeds: [errEmbed], ephemeral: true })
        }
    }
};
