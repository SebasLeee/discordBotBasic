const rrSchema = require('../../Models/ReactionRoles');
const {SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('addrole')
    .setDescription('Reaction Role add')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addRoleOption(option=>
        option.setName('role')
        .setDescription('Rol para asignar')
        .setRequired(true)
    )
    .addStringOption(option=>
        option.setName('description')
        .setDescription('Descripcion del Rol')
        .setRequired(false)
    )
    .addStringOption(option=>
        option.setName('emoji')
        .setDescription('Emoji del rol')
        .setRequired(false)
    ),
    async execute(interaction){
        const {options,guildId,member} = interaction
        const role = options.getRole('role')        
        const description = options.getString('description')
        const emoji = options.getString('emoji')

        try {
            if(role.position >= member.roles.highest.position)
                return interaction.reply({content:"No tengo permisos para esto", ephemeral:true})
            const data = await rrSchema.findOne({GuildID:guildId})

            const newRole = {
                roleId:role.id,
                roleDescription: description || 'No description',
                roleEmoji: emoji
            }

            if(data){
                let = roleData = data.roles.find((x)=>x.roleId === role.id)
                if(roleData){
                    roleData = new roleData
                }else{
                    data.roles = [...data.roles, newRole]
                }

                await data.save()
            }else{
                await rrSchema.create({
                    GuildID:guildId,
                    roles:newRole
                })
            }
            return interaction.reply({content:`Se ha creado un nuevo rol **${role.name}**`})



        } catch (error) {
            console.log(error);
        }
    }
};
