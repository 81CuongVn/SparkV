const Discord = require(`discord.js`);

const SlotItems = [
  `🍅`,
  `🍇`,
  `🍈`,
  `🍉`,
  `🍊`,
  `🍌`,
  `🍍`,
  `🍑`,
  `🍒`,
  `🍓`,
  `🍋`,
  `🍐`,
  `🍎`,
  `🍏`,
  `🥑`,
  `🥝`,
  `🥭`,
  `🍠`,
  `🍅`,
  `🍆`,
  `🥔`,
  `🥕`,
  `🥒`,
  `💵`,
  `💸`,
  `💰`
]

exports.run = async (Bot, message, Arguments) => {
  if (!Arguments) {
    return message.lineReply(`${Bot.Config.Bot.Emojis.error} | lol you need to tell me how much to bet.`)
  }

  var Ch1llBucks = await Bot.Database.get(`UserData.${message.author.id}.ch1llbucks`)
  var win = false

  if (Ch1llBucks === 0 || Ch1llBucks === null) {
    return message.lineReply(`${Bot.Config.Bot.Emojis.error} | You have no Ch1llBucks!`)
  }

  if (isNaN(Arguments[0])){
    return message.lineReply(`${Bot.Config.Bot.Emojis.error} | That's not a number!`)
  }

  if (message.content.includes(`-`)){
    return message.lineReply(`${Bot.Config.Bot.Emojis.error} | You cannot bet negitive Ch1llBucks lol.`)
  }

  if (Arguments[0] > Ch1llBucks){
    return message.lineReply(`${Bot.Config.Bot.Emojis.error} | You don't have that much lol.`)
  }

  let number = []

  for (i = 0; i < 3; i++){
    number[i] = Math.floor(Math.random() * SlotItems.length)
  }

  if (number[0] == number[1] && number[1] == number[2]){
    Arguments[0] *= 9
    win = true
  } else if (number[0] == number[1] || number[0] == number[2] || number[1] == number[2]){
    Arguments[0] *= 2
    win = true
  }

  if (win){
    message.lineReplyNoMention(`${SlotItems[number[0]]} | ${SlotItems[number[1]]} | ${SlotItems[number[2]]}\n\n${Bot.Config.Bot.Emojis.success} | You won ❄${await Bot.FormatNumber(parseInt(Arguments[0]) * 4)} Ch1llBucks!`)
    
    await Bot.Database.add(`UserData.${message.author.id}.ch1llbucks`, Arguments[0] * SlotItems.length)
  } else {
    message.lineReplyNoMention(`${SlotItems[number[0]]} | ${SlotItems[number[1]]} | ${SlotItems[number[2]]}\n\n${Bot.Config.Bot.Emojis.error} | You lost ❄${await Bot.FormatNumber(parseInt(Arguments[0]))} Ch1llBucks.`)
    
    await Bot.Database.subtract(`UserData.${message.author.id}.ch1llbucks`, Arguments[0])
  }
},

  exports.config = {
    name: `Slots`,
    description: `Don't gamble kids!`,
    aliases: [`bet`],
    usage: `<amount>`,
    category: `💰currency💰`,
    bot_permissions: [`SEND_MESSAGES`, `EMBED_LINKS`, `VIEW_CHANNEL`],
    member_permissions: [],
    enabled: true,
    cooldown: 15
  }