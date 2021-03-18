const Discord = require("discord.js");

exports.run = async (Bot, message, Arguments) => {
  if (message.author.id !== process.env.OwnerID) {
    return message.channel.send("❌Access denied.")
  }

  function clean(text) {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
      return text;
  }

  if (Arguments[0].toLowerCase() === "bot:fetch(guilds)") {
    Bot.guilds.cache.forEach(async (guild) => {
      const channel = guild.channels.cache
        .filter((channel) => channel.type === 'text')
        .first()

      if (!guild.member(Bot.user).hasPermission('CREATE_INSTANT_INVITE')) {
        return;
      }

      await channel
        .createInvite({ maxAge: 120, maxUses: 1 })
        .then(async (invite) => {
          console.log(`${guild.name} - ${invite.url}`)
        })
        .catch((error) => console.log(error));
    })
  } else {

    try {
      const code = Arguments.join(" ")
      var evaled = eval(code)
  
      if (typeof evaled !== "string"){
        evaled = require("util").inspect(evaled)
      }

      if (evaled.includes(process.env.token)){
        evaled = evaled.replace(process.env.token, "BOT_TOKEN")
      }
  
      message.channel.send(clean(evaled), { code: "js" })
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``)
    }
  }
},

  exports.config = {
    name: "Eval",
    description: "This is an owner only command.",
    aliases: [],
    usage: "",
    category: "👑owner only👑",
    bot_permissions: ["SEND_MESSAGES", "EMBED_LINKS", "VIEW_CHANNEL"],
    member_permissions: [],
    enabled: true,
    cooldown: 1.5
  }