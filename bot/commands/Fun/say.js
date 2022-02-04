const Discord = require("discord.js");

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	args = args.join(" ");

	if (args.length >= 512) return await message.replyT("That's too long for a message for SparkV to say.");
	if (args.includes("@everyone") || args.includes("@here")) return await message.replyT("Nice try kid, I won't let you abuse me.");

	message.replyT(`${args}\n*-${message.author.username}*`);
	message.delete().catch(_ => {});
}

module.exports = new cmd(execute, {
	description: "I will say whatever you want me to say.",
	aliases: [],
	dirname: __dirname,
	usage: `<message>`,
	cooldown: 15,
});
