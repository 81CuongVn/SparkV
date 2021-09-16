const Discord = require("discord.js");

const cmd = require("../../templates/command");

module.exports = new cmd(
  async () => {
    const InvitesEmbend = new Discord.MessageEmbed()
      .setTitle("Invites")
      .setDescription(`The following are links for SparkV!`)
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true, format: "gif" }))
      .addField("**Support Server**", `[Click Here](${bot.config.bot.support.invite})`, true)
      .addField("**Bot Invite**", `[Click Here](${bot.config.bot.bot_invite})`, true)
      .setFooter(`Invites for SparkV • ${bot.config.bot.Embed.Footer}`, bot.user.displayAvatarURL())
      .setColor(bot.config.bot.Embed.Color);

    await message.reply(InvitesEmbend);
  },
  {
    description: "Displays links.",
    dirname: __dirname,
    usage: "",
    aliases: ["invite", "support"],
    perms: ["EMBED_LINKS"],
  },
);
