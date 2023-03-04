const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require('discord.js')
const Levels = require('discord.js-leveling')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('level')
    .setDescription('Adjust a user level')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand=>
        subcommand.setName('add')
        .setDescription('Add levels to user')
        .addUserOption(option=>
            option.setName('target')
            .setDescription('Select a user')
            .setRequired(true)
        )
        .addIntegerOption(option=>
            option.setName('ammount')
            .setMinValue(0)
            .setDescription('Ammount of levels')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand=>
        subcommand.setName('remove')
        .setDescription('Remove level from user')
        .addUserOption(option=>
            option.setName('target')
            .setDescription('Select a user')
            .setRequired(true)
        )
        .addIntegerOption(option=>
            option.setName('ammount')
            .setMinValue(0)
            .setDescription('Ammount of levels')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand=>
        subcommand.setName('set')
        .setDescription('set a user`s levels')
        .addUserOption(option=>
            option.setName('target')
            .setDescription('Select a user')
            .setRequired(true)
        )
        .addIntegerOption(option=>
            option.setName('ammount')
            .setMinValue(0)
            .setDescription('Ammount of levels')
            .setRequired(true)
        )
    ),
    async execute(interaction) {
        const {options, guildId} = interaction;

        const sub = options.getSubcommand();
        const target = options.getUser('target')
        const ammount = options.getInteger('ammount')
        const embed = new EmbedBuilder()

        try {
            switch(sub){
                case 'add':
                    await Levels.appendLevel(target.id, guildId, ammount)
                    embed.setDescription(`Se agrego ${ammount} levels to ${target}`).setColor('Random').setTimestamp()
                    break;
                case 'remove':
                    await Levels.subtractLevel(target.id, guildId, ammount)
                    embed.setDescription(`Se removio ${ammount} levels from ${target}`).setColor('Random').setTimestamp()
                    break;
                case 'set':
                    await Levels.setLevel(target.id, guildId, ammount)
                    embed.setDescription(`Set ${target} levels to ${ammount}`).setColor('Random').setTimestamp()
                    break;
            }
        } catch (error) {
            console.log(error);
        }

        interaction.reply({embeds:[embed], ephemeral:true})
    }
};
