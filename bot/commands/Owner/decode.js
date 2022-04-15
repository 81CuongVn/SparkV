const Discord = require("discord.js");

const cmd = require("@templates/command");

async function execute(bot, message, args, command, data) {
	const type = args[0];
	const string = args.join(" ").slice(type.length + 1);

	let decoded;
	if (type === "base64") {
		decoded = Buffer.from(string, "base64").toString();
	} else if (type === "hex") {
		decoded = Buffer.from(string, "hex").toString("utf8");
	} else if (type === "url") {
		decoded = decodeURIComponent(string);
	}

	if (!decoded) return message.replyT(`${bot.config.emojis.error} Uh oh! An error occured while trying to decode the text. Please try again, but with a different string.`);

	await message.replyT(decoded);
}

module.exports = new cmd(execute, {
	description: "Decode a string that was once encoded.",
	dirname: __dirname,
	usage: "(text) (type)",
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
},
);
