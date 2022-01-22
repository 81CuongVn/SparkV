const Discord = require("discord.js");

const cmd = require("../../templates/command");

module.exports = new cmd(
	async (bot, message) => {
		await message.replyT(`${bot.config.emojis.error} | You don't have a job noob. You have to go get one to work lol.`);
	},
	{
		description: "Work for your job and earn some coins.",
		dirname: __dirname,
		aliases: ["job"],
		usage: ``,
		slash: true
	},
);
