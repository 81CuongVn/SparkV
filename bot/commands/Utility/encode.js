const Discord = require("discord.js");

const cmd = require("@templates/command");

async function execute(bot, message, args, command, data) {
	const type = data.options.getString("type");
	const string = data.options.getString("text");

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
	perms: [],
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 3,
			name: "text",
			description: "The text to encode.",
			required: true
		},
		{
			type: 3,
			name: "type",
			description: "The type of encoding to use. Types: `base64`, `hex` or `url`",
			required: true,
			choices: [
				{
					name: "base64",
					value: "base64"
				},
				{
					name: "hex",
					value: "hex"
				},
				{
					name: "url",
					value: "url"
				}
			]
		},
	]
});
