const Discord = require("discord.js");

exports.run = async (Bot, message, Arguments) => {
  if (!message.member.voice.channel){
    return message.channel.send("You must be in a __**voice channel**__ to use this command!").then(m => m.delete({ timeout: 5000 }))
  }
  
  if (!Bot.distube.isPlaying(message)){
    return message.channel.send("A song must be __**playing**__ to use this command!")
  }
  
  Bot.distube.jump(message, parseInt(Arguments[0])).catch(() => message.channel.send("Invalid song number!").then(m => m.delete({ timeout: 5000 })))
},

exports.config = {
  enabled: true,
  guild_only: true,
  aliases: ["ju"],
  bot_permissions: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "EMBED_LINKS", "VIEW_CHANNEL", "CONNECT", "SPEAK"]
},
    
exports.help = {
  name: "Jump",
  description: "I will jump to a certain song in the queue.",
  usage: "<number>",
  category: "🎵music🎵",
  cooldown: 3
}