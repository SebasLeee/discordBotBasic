const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require('discord.js')
const Levels = require('discord.js-leveling')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('xp')
    .setDescription('Adjust a user xp')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand=>
        subcommand.setName('add')
        .setDescription('Add xp to user')
        .addUserOption(option=>
            option.setName('target')
            .setDescription('Select a user')
            .setRequired(true)
        )
        .addIntegerOption(option=>
            option.setName('ammount')
            .setMinValue(0)
            .setDescription('Ammount of xp')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand=>
        subcommand.setName('remove')
        .setDescription('Remove xp from user')
        .addUserOption(option=>
            option.setName('target')
            .setDescription('Select a user')
            .setRequired(true)
        )
        .addIntegerOption(option=>
            option.setName('ammount')
            .setMinValue(0)
            .setDescription('Ammount of xp')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand=>
        subcommand.setName('set')
        .setDescription('set a user`s xd')
        .addUserOption(option=>
            option.setName('target')
            .setDescription('Select a user')
            .setRequired(true)
        )
        .addIntegerOption(option=>
            option.setName('ammount')
            .setMinValue(0)
            .setDescription('Ammount of xp')
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
                    await Levels.appendXp(target.id, guildId, ammount)
                    embed.setDescription(`Se agrego ${ammount} xp to ${target}`).setColor('Random').setTimestamp()
                    break;
                case 'remove':
                    await Levels.subtractXp(target.id, guildId, ammount)
                    embed.setDescription(`Se removio ${ammount} xp from ${target}`).setColor('Random').setTimestamp()
                    break;
                case 'set':
                    await Levels.setXp(target.id, guildId, ammount)
                    embed.setDescription(`Set ${target} xp to ${ammount}`).setColor('Random').setTimestamp()
                    break;
            }
        } catch (error) {
            console.log(error);
        }

        interaction.reply({embeds:[embed], ephemeral:true})
    }
};
