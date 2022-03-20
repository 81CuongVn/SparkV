const Discord = require("discord.js");

const cmd = require("../../templates/command");

async function execute(bot, message, args) {
	const type = data.options.getString("type");
	const string = data.options.getString("text");

	if (type === "base64") {
		await message.replyT(Buffer.from(string.join(" "), "base64").toString());
	} else if (type === "hex") {
		await message.replyT(Buffer.from(string.join(" "), "hex").toString("utf8"));
	} else if (type === "url") {
		await message.replyT(decodeURIComponent(string.join(" ")));
	}
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
