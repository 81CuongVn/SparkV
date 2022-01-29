const Discord = require("discord.js");

const cmd = require("../../templates/command");

module.exports = new cmd(
	async (bot, message) => await message.replyT(`${bot.config.emojis.success} | Here's my website! https://${process.env.BASEURL}/`),
	{
		description: "I'll send my website!",
		dirname: __dirname,
		usage: "",
		aliases: ["web"],
		perms: ["EMBED_LINKS"],
		slash: true
	},
);
