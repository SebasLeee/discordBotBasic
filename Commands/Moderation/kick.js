const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kickear un usuario")
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption(option =>
            option.setName("usuario")
                .setDescription("Usuario a ser kickeado.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("razon")
                .setDescription("Razon del kick.")
        ),

    async execute(interaction) {
        const { channel, options } = interaction;

        const user = options.getUser("usuario");
        const reason = options.getString("razon") || "Sin razón";

        const member = await interaction.guild.members.fetch(user.id);
        const errEmd = new EmbedBuilder()
            .setDescription(`No puedes kickearte`)
            .setColor(0xc72c3b)
        const errEmbed = new EmbedBuilder()
            .setDescription(`No puedes kickear a ${user.username} ya que tienen un rol mayor.`)
            .setColor(0xc72c3b)

        if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({ embeds: [errEmbed], ephemeral: true });
        await member.kick(reason);

        const embed = new EmbedBuilder()
            .setTitle(":mans_shoe: Usuario Kickeado")
            .setDescription(`${user} fue kickeado del servidor \n **Razón:** ${reason} \n **Por:** <@${interaction.user.id}>`)
            .setColor(0x5fb041)
            .setTimestamp()

        await interaction.reply({
            embeds: [embed],
        });
    }
}