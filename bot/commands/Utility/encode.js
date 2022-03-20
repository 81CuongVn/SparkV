const Discord = require("discord.js");

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	const type = data.options.getString("type");
	const string = data.options.getString("text");

	if (type === "base64") {
		await message.replyT(Buffer.from(string.join(" ")).toString("base64"));
	} else if (type === "hex") {
		const h = Buffer.from(string.join(" ")).toString("base64");
		const e = Buffer.from(h, "base64");

		await message.replyT(e.toString("hex"));
	} else if (type === "url") {
		await message.replyT(encodeURIComponent(string.join(" ")));
	}
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
