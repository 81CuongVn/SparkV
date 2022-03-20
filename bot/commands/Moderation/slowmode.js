const Discord = require(`discord.js`);

const cmd = require("../../templates/modCommand");

async function execute(bot, message, args, command, data) {
	const channel = data.options.getChannel("channel");
	const seconds = data.options.getNumber("seconds");

	if (seconds > 21600) return await message.replyT(`${bot.config.emojis.error} | That's too high of a number! The maximum I can set that channel to is **6 hours** do to Discord API limits.`);

	try {
		channel.setRateLimitPerUser(seconds);
		await message.replyT(`${bot.config.emojis.success} | Slowmode is now ${seconds} seconds.`);
	} catch (err) {
		return await message.replyT(`${bot.config.emojis.error} | I cannot set the slowmode for this channel! Please check my permissions and try again.`);
	}
}

module.exports = new cmd(execute, {
	description: "Applies a slowmode to a channel.",
	dirname: __dirname,
	aliases: ["slow"],
	usage: `(user) <reason>`,
	perms: ["MANAGE_CHANNELS"],
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 7,
			name: "channel",
			description: "The channel to apply a slowmode too.",
			required: true
		},
		{
			type: 10,
			name: "seconds",
			description: "The amount of seconds to set the slowmode to.",
			required: true
		}
	]
});
