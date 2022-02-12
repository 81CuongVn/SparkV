const Discord = require("discord.js");

const cmd = require("../../templates/modCommand");

async function execute(bot, message, args, command, data) {
	try {
		message.guild.roles.cache.forEach(role => {
			message.channel.createOverwrite(role, {
				SEND_MESSAGES: true,
			});
		});
	} catch (err) {}

	await message.replyT(`${bot.config.emojis.success} | Channel is now unlocked.`);
}

module.exports = new cmd(execute, {
	description: "I'll unlock the current channel.",
	dirname: __dirname,
	aliases: ["ulock"],
	usage: "",
	perms: ["MANAGE_CHANNELS"],
});
