const Discord = require("discord.js");

exports.run = async (Bot, message, Arguments) => {
  if (message.deletable) {
    message.delete()
  }

  if (isNaN(Arguments[0]) || parseInt(Arguments[0]) <= 0) {
    return message.channel.send("That's not a number.").then(m => m.delete({ timeout: 5000 }))
  }

  let DeleteAmount

  if (parseInt(Arguments[0]) > 100) {
    DeleteAmount = 100
  } else {
    DeleteAmount = parseInt(Arguments[0])
  }

  try {
    message.channel.bulkDelete(DeleteAmount, true).then(() => {
      message.channel.send(`Successfully deleted ${DeleteAmount} messages.`).then(m => m.delete({ timeout: 5000 }))
    })
  } catch (err) {
    message.channel.send(`Uh oh... I couldn't delete these messages!`).then(m => m.delete({ timeout: 5000 }))
  }
},

exports.config = {
  name: "Clear",
  description: "I can delete messages for you so you don't have to spend a while deleting them :)",
  aliases: ["purge", "clr"],
  usage: "<number of messages to delete>",
  category: "🛠️moderation🛠️",
  bot_permissions: ["SEND_MESSAGES", "EMBED_LINKS", "VIEW_CHANNEL", "MANAGE_MESSAGES"],
  member_permissions: ["MANAGE_MESSAGES"],
  enabled: true,
  cooldown: 5
}