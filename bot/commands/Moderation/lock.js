const Discord = require("discord.js");

const cmd = require("../../templates/modCommand");

async function execute(bot, message, args, command, data) {
	try {
		message.guild.roles.cache.forEach(role => {
			message.channel.createOverwrite(role, {
				SEND_MESSAGES: false,
			});
		});
	} catch (err) {}

	await message.replyT("Channel is now locked.");
}

module.exports = new cmd(execute, {
	description: "I'll lock the current channel.",
	dirname: __dirname,
	aliases: [],
	usage: "",
	perms: ["MANAGE_CHANNELS"],
});
