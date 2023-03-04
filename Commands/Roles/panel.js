const rrSchema = require('../../Models/ReactionRoles')
const {SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, Embed} = require('discord.js')

module.exports = {
    data:new SlashCommandBuilder()
    .setName('panel')
    .setDescription('Panel de reaccion roles')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
    async execute(interaction){
        const {options, guildId, guild, channel} = interaction
        
        try {
            const data = await rrSchema.findOne({GuildID:guildId})

            if(!data.roles.length>0)
                return interaction.reply({content:"Este servidor no tienen ninguna data", ephemeral:true})
            const panelEmbed = new EmbedBuilder()
            .setDescription('Porfavor selecciona el rol')
            .setColor('Aqua')

            const options = data.roles.map(x => {
                const role = guild.roles.cache.get(x.roleId)

                return{
                    label:role.name,
                    value:role.id,
                    description:x.roleDescription,
                    emoji:x.roleEmoji || undefined
                }
            })

            const menuComponents = [
                new ActionRowBuilder().addComponents(
                    new SelectMenuBuilder()
                    .setCustomId('reaction-roles')
                    .setMaxValues(options.length)
                    .addOptions(options)
                    .setMinValues(0),
                ),
            ];

            channel.send({embeds:[panelEmbed], components: menuComponents})

            return interaction.reply({content:"Enviado correctamente", ephemeral:true})
        } catch (error) {
            console.log(error);
        }
    }
};
