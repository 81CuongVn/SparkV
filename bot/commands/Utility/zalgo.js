const Discord = require("discord.js");
const Zalgo = require("to-zalgo");

const cmd = require("../../templates/command");

module.exports = new cmd(async (bot, message, args, command, data) => {
	const text = message?.applicationId ? data.options.getString("text") : args.join(" ");

	if (!text) return await message.replyT("You need to enter some text to zalgo.");

	return await message.replyT(Zalgo(text));
}, {
	description: "Generate zalgo text.",
	dirname: __dirname,
	usage: "(text)",
	aliases: ["zgen"],
	perms: [],
	slash: true,
	requireArgs: true,
	options: [
		{
			type: 3,
			name: "text",
			description: "text to zalgo.",
			required: true
		}
	]
});
