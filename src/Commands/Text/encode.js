const Discord = require("discord.js");

const cmd = require("@structures/command");

async function execute(bot, message, args, command, data) {
	const type = args[0];
	const string = args.join(" ").slice(type.length + 1);

	let encoded;
	if (type === "base64") {
		encoded = Buffer.from(string).toString("base64");
	} else if (type === "hex") {
		encoded = (Buffer.from(Buffer.from(string).toString("base64"), "base64")).toString("hex");
	} else if (type === "url") {
		encoded = encodeURIComponent(string);
	}

	if (!encoded) return message.replyT(`${bot.config.emojis.error} Uh oh! An error occured while trying to encode the text. Please try again, but with a different string.`);

	await message.replyT(encoded);
}

module.exports = new cmd(execute, {
	description: "Encode a string.",
	dirname: __dirname,
	usage: "(string) (type)",
	aliases: [],
	perms: []
});
