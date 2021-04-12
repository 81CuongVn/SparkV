const Discord = require("discord.js");

exports.run = async (Bot, message, Arguments, command) => {
  if (Bot.Config.Debug === true) {
    return
  }

  const noblox = require("noblox.js");

  try {
    const UserID = await noblox.getIdFromUsername(Arguments[0])

    await noblox.getPlayerInfo(UserID).then((PlayerInfo) => {
      const InfoEmbed = new Discord.MessageEmbed()
        .setTitle(`${PlayerInfo.username}'s Profile`)
        .setDescription(`*${PlayerInfo.status || "No status."}*`)
        .addField(`**Account Age**`, `${PlayerInfo.age || "N/A"} days old (${PlayerInfo.joinDate || "N/A"})`)
        .addField(`**Description**`, PlayerInfo.blurb || "N/A")
        .setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${UserID}&width=420&height=420&format=png`)
        .setURL(`https://www.roblox.com/users/${UserID}/profile`)
        .setFooter(`Username: ${PlayerInfo.username} | UserID: ${UserID} • ${Bot.Config.Embed.EmbedFooter}`)
        .setColor(Bot.Config.Embed.EmbedColor)

        message.channel.send(InfoEmbed)
    })
  } catch (err){
    const ErrorEmbed = new Discord.MessageEmbed()
      .setTitle(`404 | User Not Found`)
      .setDescription("Uh oh! Looks like this user doesn't exist or roblox is down. Check [Roblox Status](https://status.roblox.com/).")
      .setFooter(`User not found • ${Bot.Config.Embed.EmbedFooter}`)
      .setThumbnail("https://media.discordapp.net/attachments/539579135786352652/641188940983959555/627171202464743434.png")
      .setColor(Bot.Config.Embed.EmbedColor)
      .setTimestamp()

      message.channel.send(ErrorEmbed)
  }
},

  exports.config = {
    name: "🆕WhoIs",
    description: "Ch1llBlox will look up any user and return information on that user.",
    aliases: ["who"],
    usage: "<username>",
    category: "⚫roblox⚫",
    bot_permissions: ["SEND_MESSAGES", "EMBED_LINKS", "VIEW_CHANNEL"],
    member_permissions: [],
    enabled: true,
    cooldown: 10
  }