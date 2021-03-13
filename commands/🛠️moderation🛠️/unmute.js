const Discord = require("discord.js");

exports.run = async (Bot, message, Arguments) => {
  const User = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(Arguments[0]) || `@<${Arguments[0]}>`;
  const Reason = Arguments.join(" ").slice(22) || "No reason provided."

  if (!Arguments[0]) {
    return message.channel.send("❌Please mention someone to mute!").then(m => m.delete({ timeout: 5000 }))
  }

  if (!User) {
    return message.channel.send("❌I cannot find that member!").then(m => m.delete({ timeout: 5000 }))
  }

  if (User.id === message.author.id) {
    return message.channel.send("❌You cannot unmute yourself.").then(m => m.delete({ timeout: 5000 }))
  }

  if (!User.kickable) {
    return message.channel.send("❌Uh oh... I can't unmute this user!").then(m => m.delete({ timeout: 5000 }))
  }

  const Role = message.guild.roles.cache.find(role => role.name === "Muted")

  if (!Role){
    return message.channel.send("❌I couldn't find the muted role! Please make sure the role is called, \"Muted\".")
  }

  if (User.roles.cache.has(Role)){
    return message.channel.send("❌This user isn't muted!")
  }

  if(user.roles.cache.has(role)) return message.channel.send("This member isn't muted");


  const VerificationEmbed = new Discord.MessageEmbed()
    .setTitle("Convermination Prompt")
    .setDescription("Are you sure you want to do this?")
    .setFooter("Canceling in 60 seconds if no emoji reacted.")

  const VerificationMessage = await message.channel.send(VerificationEmbed)
  const Emoji = await Bot.PromptMessage(VerificationMessage, message.author, ["✅", "❌"], 60)

  if (Emoji === "✅") {
    // Yes
    message.delete()

    User.roles.add(Role)
    User.send(`You have been unmuted in ${message.guild.name}. Reason: ${Reason}.`).catch((err) => {})

    const MuteEmbend = new Discord.MessageEmbed()
      .setTitle("Unmute Command")
      .setDescription(`*✅Successfully unmuted ${User}(${User.id})✅*`)
      .setThumbnail(User.avatar)
      .addField("Moderator/Admin: ", `${message.author.tag}`)
      .addField("Reason: ", Reason)
      .setFooter(`${process.env.prefix}Mute to mute a user.`)
      .setColor(process.env.EmbedColor)
      .setTimestamp();

    message.channel.send(MuteEmbend);
  } else if (emoji === "❌") {
    message.delete()

    message.channel.send("❌Unmute canceled.").then(m => m.delete({ timeout: 10000 }))
  }
},
 
  exports.config = {
    name: "Unmute",
    description: "I'll unmute someone who was muted previously.",
    aliases: [],
    usage: "<user> <reason>",
    category: "🛠️moderation🛠️",
    bot_permissions: ["SEND_MESSAGES", "EMBED_LINKS", "VIEW_CHANNEL", "MANAGE_CHANNELS"],
    member_permissions: ["MANAGE_ROLES"],
    enabled: true,
    cooldown: 5
  }