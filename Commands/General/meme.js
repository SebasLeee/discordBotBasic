const {SlashCommandBuilder,EmbedBuilder} = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({default:fetch})=>fetch(...args));

module.exports = {
    data:new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Obtienes un meme random')
    .addStringOption(option =>
        option.setName('plataforma')
        .setDescription('Meme plataforma (No es requerido)')
        .addChoices({name:'Reddit', value:'reddit'},{name:"Giphy", value:'giphy'})
    ),

    async execute(interaction){
        const {guild, options, member} = interaction

        const plataforma = options.getString('plataforma')
        const embed = new EmbedBuilder()

        async function redditMeme(){
            await fetch('https://www.reddit.com/r/memes/random/.json').then(async res=>{
                let meme = await res.json()

                let title = meme[0].data.children[0].data.title;
                let url = meme[0].data.children[0].data.url;
                let author = meme[0].data.children[0].data.author;
                return interaction.reply({embeds:[embed.setTitle(`${title}`).setImage(url).setURL(url).setColor("Random").setFooter({text:author})]})
            })
        }
        
        async function giphyMeme(){
            await fetch('AQUI VA TU API DE GIPHY').then(async res=>{
                let meme = await res.json()

                let title = meme.data.title;
                let url = meme.data.images.original.url;
                let link = meme.data.url;
                let author = meme.data.user.display_name;
                let pf = meme.data.user.avatar_url;
    
                return interaction.reply({embeds:[embed.setTitle(`${title}`).setImage(`${url}`).setURL(link).setColor("Random").setFooter({text:author, iconURL:pf})]})
            })
        }

        if(plataforma === 'reddit'){
            redditMeme()
        }
        if(plataforma === 'giphy'){
            giphyMeme()
        }
        if(!plataforma){
            let memes = [giphyMeme,redditMeme]
            memes[Math.floor(Math.random() * memes.length)]()
        }
    }
        
};

