const {
  ComponentType,
  EmbedBuilder,
  SlashCommandBuilder,
  ActionRowBuilder,
  SelectMenuBuilder,
  Embed,
  StringSelectMenuBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Obtienes la lista de comandos del bot "),
  async execute(interaction) {
    const emojis = {
      info: "📖",
      moderation: "🔩",
      general: "🌐",
      ticket: "📨",
      levels: "📈",
      roles: "🔰"
    };

    const directories = [
      ...new Set(interaction.client.commands.map((cmd) => cmd.folder)),
    ];
    const formatString = (str) =>`${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`

    const categores = directories.map((dir) => {
      const getCommands = interaction.client.commands
        .filter((cmd) => cmd.folder === dir)
        .map((cmd) => {
          return {
            name: cmd.data.name,
            description:
              cmd.data.description ||
              "There is no description for this command",
          };
        });

      return {
        directory: formatString(dir),
        commands: getCommands,
      };
    });

    const embed = new EmbedBuilder().setDescription(
      "Porfavor elige la categoria el menu"
    );
      
    const components = (state) => [
      new ActionRowBuilder().addComponents(
        new SelectMenuBuilder()
          .setCustomId("help-menu")
          .setPlaceholder("Porfavor elige la categoria")
          .setDisabled(state)
          .addOptions(
            categores.map((cmd) => {
              return {
                label: cmd.directory,
                value: cmd.directory.toLowerCase(),
                description: `Comandos de ${cmd.directory} categoria`,
                emoji: emojis[cmd.directory.toLowerCase() || null],
              };
            })
          )
      ),
    ];

    const initialMessage = await interaction.reply({
      embeds: [embed],
      components: components(false),
    });
    const filter = (interaction) =>
      interaction.user.id === interaction.member.id;
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      ComponentType: ComponentType.StringSelectMenu,
    });
    collector.on("collect", (interaction) => {
      const [directory] = interaction.values;
      const category = categores.find(
        (x) => x.directory.toLowerCase() === directory
      );

      const categoryEmbed = new EmbedBuilder()
        .setTitle(`${formatString(directory)} comandos`)
        .setDescription(`La lista de comandos ${directory}`)
        .addFields(
          category.commands.map((cmd) => {
            return {
              name: `\`${cmd.name}\``,
              value: cmd.description,
              inline: true,
            };
          })
        );
      interaction.update({ embeds: [categoryEmbed] });
    });
    collector.on("end", () => {
      initialMessage.edit({ components: components(true) });
    });
  },
};
