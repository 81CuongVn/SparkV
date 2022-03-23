const Discord = require("discord.js");

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	const text = data.options.getString("message");

	if (text.length >= 100) return await message.replyT("Please keep the text under 100 characters.");
	if (text.includes("@everyone") || text.includes("@here")) return await message.replyT("Nice try kid. No pings for you.");

	await message.replyT(`${text}\n*-${message.user.tag}*`);
	message.delete().catch(_ => {});
}

module.exports = new cmd(execute, {
	description: "I will say whatever you want me to say.",
	aliases: [],
	dirname: __dirname,
	usage: `(message)`,
	cooldown: 15,
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 3,
			name: "message",
			description: "The message for me to say.",
			required: true
		}
	]
});
