const { model, Schema} = require("mongoose")

let ticketSchema = new Schema({
    GuildID : String,
    MembersID: [String],
    TicketID: String,
    ChannelID: String,
    Closed: Boolean,
    Locked: Boolean,
    Type: String,
    Claimed: Boolean,
    ClaimedBy: String,
    Open:Boolean,
    OpenBy:String,
})

module.exports = model("Ticket", ticketSchema);