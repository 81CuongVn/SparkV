const Discord = require("discord.js");

exports.run = async (Bot, message, Arguments) => {
  const User = message.mentions.users.first() || Bot.users.cache.get(Arguments[0]) || message.author

  if (process.env.TestMode) {
    return
  }

  const canvacord = require("canvacord");

  const Avatar = User.displayAvatarURL({
    dynamic: false,
    format: "png"
  })

  const Image = await canvacord.Canvas.invert(Avatar)
  const Invert = new Discord.MessageAttachment(Image, "invert.png")

  message.channel.send(Invert)
},

  exports.config = {
    enabled: true,
    guild_only: true,
    aliases: ["cmm"],
    bot_permissions: ["SEND_MESSAGES", "EMBED_LINKS", "VIEW_CHANNEL"]
  },

  exports.help = {
    name: "ChangeMyMind",
    description: "Change my mind meme.",
    usage: "<text>",
    category: "📷images📷",
    cooldown: 2
  }