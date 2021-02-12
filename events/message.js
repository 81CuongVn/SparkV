const Discord = require("discord.js");

exports.run = async (Bot, Message) => {
  if (Message.author.Bot) {
    return;
  }
  
  const data = await Bot.Settings.findOne({
    Guild: `${Message.guild.name} (${Message.guild.id})`
  })
  
  if (data){
    if (!Message.content.startsWith(data.Settings.Prefix)){
      return
    }
  } else{
    if (!Message.content.startsWith(process.env.prefix)){
      return
    }
  }
  
  const args = Message.content
    .slice(process.env.prefix.length)
    .trim()
    .split(/ +/);
  
  const command = args.shift().toLowerCase();
  const commandfile = Bot.commands.get(command) || Bot.commands.find(command_ => command_.config.aliases && command_.config.aliases.includes(command));

  if (!commandfile) {
    return
  }
  
  if (process.env.BannedUserIds.includes(Message.author.id)){
    return Message.channel.send("Whoa there buster! You're banned. You cannot use this command.")
  }
  
  // Update 1.2: Forced to remove "commandfile.config.guild_only &&" because Discord.js broke message.reply().
  if (Message.channel.type === "dm") {
    return
  }

  for (const permission of commandfile.config.bot_permissions){
    if (!message.guild.me.hasPermission(permission)){
      return msg.channel.send(`❌I don't have permission to do that! Please select my role and allow ${permission}.`).then(m => m.delete({ timeout: 5000 }))
    }
  }

  if (!commandfile.config.enabled) {
    return Message.reply("This command is currently disabled! Please try again later.")
  }

  if (!Bot.cooldowns.has(command.name)) {
    Bot.cooldowns.set(command.name, new Discord.Collection());
  }

  const Now = Date.now();
  const Timestamps = Bot.cooldowns.get(command.name);
  const CooldownAmount = (command.cooldown || 3) * 1000;

  if (Timestamps.has(Message.author.id)) {
    const ExpireTime = Timestamps.get(Message.author.id) + CooldownAmount;

    if (Now < ExpireTime) {
      const TimeLeft = (ExpireTime - Now) / 1000;
      
      return Message.reply({
        embed: {
          title: `Whoa there ${Message.author.username}!`,
          description: `Please wait ${TimeLeft.toFixed(1)} more second(s) to use that command again!`,
          thumbnail: Message.author.avatarURL,
          color: "#0099ff",
          footer: {
            text: "Maybe up vote our bot while you wait?",
            icon_url: process.env.bot_logo
          },
        },
        }
      )}
  }

  Timestamps.set(Message.author.id, Now);
  setTimeout(() => Timestamps.delete(Message.author.id), CooldownAmount);

  commandfile
    .run(Bot, Message, args, command)
    .then(() => { console.log(`\`\`\`\`\`\`\`\`\`\`\`\`\`\nNew Command!\nCommand: ${command}\nArguments: ${args}\nUser who activated this command: ${Message.author.tag}\n\`\`\`\`\`\`\`\`\`\`\`\`\``); 
  })
}
