const {
  ChannelType,
  ButtonInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require("discord.js");

const ticketSchema = require("../../Models/Ticket");
const TicketSetup = require("../../Models/TicketSetup");

module.exports = {
  name: "interactionCreate",

  async execute(interaction) {
    const { guild, member, customId, channel } = interaction;
    const { ViewChannel, SendMessages, ManageChannels, ReadMessageHistory } =
      PermissionFlagsBits;
    let ticketId = await ticketSchema.estimatedDocumentCount()


    let ticketPrueba = await ticketSchema.findOne({
      guildID: guild.id,
      MembersID: member.id,
      Open:true,
    });
    

    if (!interaction.isButton()) return;
    const data = await TicketSetup.findOne({ GuildID: guild.id });
    if (!data) return;
    if (!data.Buttons.includes(customId)) return;
    if (!interaction.guild.members.me.permissions.has(ManageChannels))
      interaction.reply({
        content: "No tengo permisos para esto",
        ephemeral: true,
      });
    if(ticketPrueba){
      return interaction.reply({content:`Tienes un ticket creado` , ephemeral:true}),
      console.log(ticketPrueba);
    }else{
      try {
        await guild.channels
          .create({
            name: `${member.user.username}-ticket${ticketId}`,
            type: ChannelType.GuildText,
            parent: data.Category,
            permissionOverwrites: [
              {
                id: data.Everyone,
                deny: [ViewChannel, SendMessages, ReadMessageHistory],
              },
              {
                id: member.id,
                allow: [ViewChannel, SendMessages, ReadMessageHistory],
              },
            ],
          })
          .then(async (channel) => {
            const newTicketSchema = await ticketSchema.create({
              GuildID: guild.id,
              MembersID: member.id,
              TicketID: ticketId,
              ChannelID: channel.id,
              Closed: false,
              Locked: false,
              Type: customId,
              Claimed: false,
              Open:true,
              OpenBy:interaction.user.tag,
            });
            const embed = new EmbedBuilder()
              .setTitle(`${guild.name} - Ticket: ${customId}`)
              .setDescription(
                "Bienvenido al soporte en breve nuestro equipo te atendera"
              )
              .setFooter({
                text: `${ticketId}`,
                iconURL: member.displayAvatarURL({ dynamic: true }),
              })  
              .setTimestamp();
            const button = new ActionRowBuilder().setComponents(
              new ButtonBuilder()
                .setCustomId("close")
                .setLabel("close ticket")
                .setStyle(ButtonStyle.Primary)
                .setEmoji("🔴"),
              new ButtonBuilder()
                .setCustomId("lock")
                .setLabel("Lock the ticket")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("🔐"),
              new ButtonBuilder()
                .setCustomId("unlock")
                .setLabel("Unlock de Ticket")
                .setStyle(ButtonStyle.Success)
                .setEmoji("🔒"),
              new ButtonBuilder()
                .setCustomId("claim")
                .setLabel("Claim")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("⛔")
            );
            channel.send({
              embeds: [embed],
              components: [button],
            }),
              interaction.reply({
                content: `Creado Correctamente tu ticket es <#${channel.id}>`,
                ephemeral: true,
              });
          });
      } catch (err) {
        return console.log(err);
      }
    }
  },
};
