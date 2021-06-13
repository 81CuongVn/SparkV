const { MessageEmbed  } = require(`discord.js`);

exports.run = async (Bot, message, Arguments) => {
  const User = message.mentions.members.first() || message.guild.members.cache.get(Arguments[0]) || message.guild.members.cache.find(User => User.user.username.toLowerCase() === Arguments.slice(0).join(` `) || User.user.username === Arguments[0])
  const Reason = Arguments.join(` `).slice(22) || `No reason provided.`

  if (!Arguments[0]){
    return message.lineReply(`${Bot.Config.Bot.Emojis.error} | Please mention someone to warn!`).then(m => m.delete({ timeout: 5000 }))
  }

  if (!User){
    return message.lineReply(`${Bot.Config.Bot.Emojis.error} | I cannot find that member!`).then(m => m.delete({ timeout: 5000 }))
  }

  if (User.id === message.author.id){
    return message.lineReply(`${Bot.Config.Bot.Emojis.error} | You cannot warn yourself.`).then(m => m.delete({ timeout: 5000 }))
  }

  if (!User.kickable){
    return message.lineReply(`${Bot.Config.Bot.Emojis.error} | Uh oh... I can\`t warn this user!`).then(m => m.delete({ timeout: 5000 }))
  }

  const VerificationEmbed = new MessageEmbed()
  .setTitle(`Confirmation Prompt`)
  .setDescription(`Are you sure you want to do this?`)
  .setFooter(`Canceling in 60 seconds if no emoji reacted • ${Bot.Config.Bot.Embed.Footer}`)
  .setColor(Bot.Config.Bot.Embed.Color)

  const VerificationMessage = await message.lineReplyNoMention(VerificationEmbed)
    const Emoji = await Bot.PromptMessage(VerificationMessage, message.author, [Bot.Config.Bot.Emojis.success, Bot.Config.Bot.Emojis.error], 60)

    if (Emoji === Bot.Config.Bot.Emojis.success){
      // Yes
      const warningdata = Bot.Database.get(`ServerData.${message.guild.id}.warnings.${User.id}`)
      VerificationMessage.delete()

      if (!warningdata){
        Bot.Database.set(`ServerData.${message.guild.id}.${User.id}.warnings.count`, 1)
        Bot.Database.set(`ServerData.${message.guild.id}.${User.id}.warnings`, {
          username: User.user.username,
          modname: message.author.user,
          reason: Reason,
          warnings: 1,
        })

        try {
          User.send(`You\`ve been warned in **${message.guild.name}** for ${Reason}`)
        } catch(err) {
          
        }

        message.lineReplyNoMention({
          embed: {
            title: `${Bot.Config.Bot.Emojis.success} | Successfully warned user.`,
            description: `Successfully warned ${User} for ${Reason}`,
            color: `#0099ff`,
            
            footer: {
              text: `Warn command successful.`,
              icon_url: Bot.user.displayAvatarURL()
            }
          }
        })
      } else if (warnings){
        Bot.Database.add(`ServerData.${message.guild.id}.${User.id}.warnings.count`, 1)
        Bot.Database.add(`ServerData.${message.guild.id}.${User.id}.warnings`, {
          username: User.user.username,
          modname: message.author.user,
          reason: Reason,
        })

        try {
          User.send(`${Bot.Config.Bot.Emojis.error} | You\`ve been warned in **${message.guild.name}** for ${Reason}`)
        } catch(err) {
          
        }

        message.lineReplyNoMention({
          embed: {
            title: `Successfully warned user.`,
            description: `Successfully warned ${User} for ${Reason}`,
            color: `#0099ff`,
            
            footer: {
              text: `Warn command successful.`,
              icon_url: Bot.user.displayAvatarURL()
            }
          }
        })
      }
    } else if (emoji === Bot.Config.Bot.Emojis.error){
      VerificationMessage.delete()

      message.lineReplyNoMention(`${Bot.Config.Bot.Emojis.error} | Warn canceled.`).then(m => m.delete({ timeout: 10000 }))
    }
},

  exports.config = {
    name: `Warn`,
    description: `I will warn a user`,
    aliases: [`w`],
    usage: `<user> <optional reason>`,
    category: `🛠️moderation🛠️`,
    bot_permissions: [`SEND_MESSAGES`, `EMBED_LINKS`, `VIEW_CHANNEL`, `MANAGE_MESSAGES`, `ADD_REACTIONS`],
    member_permissions: [`MANAGE_MESSAGES`],
    enabled: true,
    cooldown: 15
  }
