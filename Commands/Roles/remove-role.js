const rrSchema = require('../../Models/ReactionRoles');
const {SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('removerole')
    .setDescription('Reaction Role remove')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addRoleOption(option=>
        option.setName('role')
        .setDescription('Rol para eliminar')
        .setRequired(true)
    ),
    async execute(interaction){
        const {options,guildId,member} = interaction
        const role = options.getRole('role')        

        try {

            const data = await rrSchema.findOne({GuildID:guildId})

            if(!data)
                return interaction.reply({content:"Este server no tiene ninguna data", ephemeral:true})
            const roles= data.roles;
            const findRole = roles.find((r)=> r.roleId === role.id)

            if(!findRole)
                return interaction.reply({content:"Este rol no existe", ephemeral:true})

            const filteredRoles = roles.filter((r)=> r.roleId !== role.id)
            data.roles = filteredRoles
            await data.save()

            return interaction.reply({content:`Se ha eliminado el rol **${role.name}**`})



        } catch (error) {
            console.log(error);
        }
    }
};
