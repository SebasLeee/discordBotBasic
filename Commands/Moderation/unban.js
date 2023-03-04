const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Desbanea a un usuario.")
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption(option =>
            option.setName("idusuario")
                .setDescription("ID del usuario a desbanear.")
                .setRequired(true)
        ),

    async execute(interaction) {
        const { channel, options } = interaction;

        const userId = options.getString("idusuario");

        try {
            await interaction.guild.members.unban(userId);

            const embed = new EmbedBuilder()
                .setTitle("**:white_check_mark: Desbaneado del servidor**")
                .setDescription(`<@${userId}> fue desbaneado \n **Por:** <@${interaction.user.id}>`)
                .setColor(0x5fb041)
                .setTimestamp();

            await interaction.reply({
                embeds: [embed],
            });
        } catch (err) {
            console.log(err);

            const errEmbed = new EmbedBuilder()
                .setDescription(`Porfavor proporcione una ID válida.`)
                .setColor(0xc72c3b);

            interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }
    }
}