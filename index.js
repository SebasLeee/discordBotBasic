const {Client, GatewayIntentBits, Partials, Collection} = require('discord.js')
const logs = require('discord-logs')

const {handleLogs} = require('./Handlers/handleLogs')
const { loadEvents} = require("./Handlers/eventHandler");
const { loadCommands} = require("./Handlers/commandHandler");

const client = new Client({
    intents: [Object.keys(GatewayIntentBits)],
    partials: [Object.keys(Partials)],
});



client.commands = new Collection();
client.config = require("./config.json");
client.giveawayConfig = require("./config.js");

['giveawaysEventsHandler', 'giveawaysManager'].forEach((x) => {
    require(`./Utils/${x}`)(client);
})

module.exports = client

client.login(client.config.token).then(()=>{
    handleLogs(client)
    loadEvents(client);
    loadCommands(client);
})

