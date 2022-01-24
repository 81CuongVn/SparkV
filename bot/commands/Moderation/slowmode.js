const Discord = require(`discord.js`);

const cmd = require("../../templates/modCommand");

async function execute(bot, message, args, command, data) {
	const Channel = message.mentions.channels
		.filter(channel => channel.type === `text` && channel.guild.id === message.guild.id)
		.first();

	if (!Channel) {
		return await message.replyT(`${bot.config.emojis.error} | You cannot set slowmode in an announcements channel.`);
	}

	if (isNaN(args[0])) {
		return await message.replyT(`${bot.config.emojis.error} | That's not a nunber.`);
	}

	if (args[0] > 21600) {
		return await message.replyT(
			`${bot.config.emojis.error} | That's too high of a number! This is due to discord limiting slowmode up to 6 hours.`,
		);
	}

	message.channel.setRateLimitPerUser(args[0]);
	await message.replyT(`${bot.config.emojis.success} | Slowmode is now ${args[0]} seconds.`);
}

module.exports = new cmd(execute, {
	description: `I will set the channel's slowmode to anything you want.`,
	dirname: __dirname,
	aliases: ["slow"],
	usage: `(user) <reason>`,
	perms: ["MANAGE_CHANNELS", "MANAGE_MESSAGES"],
});
