const Discord = require(`discord.js`);

const cmd = require("../../templates/command");

module.exports = new cmd(
	async (bot, message) => {
		await message.replyT(
			`${bot.config.emojis.success} | If you want to support SparkV's developement, go to **https://sparkv.tk/donate**. Thank you!`,
		);
	},
	{
		description: `Donate to help SparkV's developement. Every donation is appreciated!`,
		dirname: __dirname,
		usage: "",
		aliases: [],
		perms: ["EMBED_LINKS"],
	},
);
