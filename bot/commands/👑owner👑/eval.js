const Discord = require(`discord.js`);

exports.run = async (Bot, message, Arguments) => {
  if (message.author.id !== process.env.OwnerID) {
    return message.lineReply(`${Bot.Config.Bot.Emojis.error} | Access denied.`)
  }

  if (!Arguments) {
    return message.lineReply(`${Bot.Config.Bot.Emojis.error} | Please input code.`)
  }

  const Input = Arguments.join(` `)

  if (!Input.toLowerCase().includes(`token`)){
    const Embed = new Discord.MessageEmbed()
      .setTitle(`${Bot.Config.Bot.Emojis.success} | Eval Results`)
    
    try {
      let Output = eval(Input)

      if (typeof Output !== `string`){
        Output = require(`util`).inspect(Output, { depth: 0 })
      }

      Embed
        .addField(`Input`, `\`\`\`js\n${Input.length > 1024 ? `Input is too long to display.` : Input}\`\`\``)
        .addField(`Output`, `\`\`\`js\n${Output.length > 1024 ? `Output is too long to display.` : Input}\`\`\``)
        .setColor(`GREEN`)
    } catch(err){
      Embed
        .addField(`Input`, `\`\`\`js\n${Input.length > 1024 ? `Input is too long to display.` : Input}\`\`\``)
        .addField(`Output`, `\`\`\`js\n${err.length > 1024 ? `Output is too long to display.` : Input}\`\`\``)
        .setColor(`GREEN`)
    }

    message.channel.send(Embed)
  } else {
    message.channel.send(`Token was contained in input. Nice try noob.`)
  }
},

  exports.config = {
    name: `Eval`,
    description: `This is an owner only command.`,
    aliases: [],
    usage: ``,
    category: `👑owner👑`,
    bot_permissions: [`SEND_MESSAGES`, `EMBED_LINKS`, `VIEW_CHANNEL`],
    member_permissions: [],
    enabled: true,
    cooldown: 1.5
  }