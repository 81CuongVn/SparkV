const Discord = require("discord.js");
const Zalgo = require("to-zalgo");

const cmd = require("../../templates/command");

module.exports = new cmd(async (bot, message, args) => {
	const text = args.join(" ");

	if (!text) return await message.replyT("You need to enter some text to zalgo.");

	return await message.replyT(Zalgo(text));
}, {
	description: "Generate zalgo text.",
	dirname: __dirname,
	usage: "<text>",
	aliases: ["zgen"],
	perms: ["EMBED_LINKS"]
});
