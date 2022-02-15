const Discord = require("discord.js");

const cmd = require("../../templates/command");

module.exports = new cmd(
	async (bot, message, args) => {
		if (!args) return await message.replyT("Next time, choose the type of decoding and the text to encode. Types: `base64`, `hex` or `url`");

		const [type, ...string] = args;

		if (type === "base64") {
			await message.replyT(Buffer.from(string.join(" "), "base64").toString());
		} else if (type === "hex") {
			await message.replyT(Buffer.from(string.join(" "), "hex").toString("utf8"));
		} else if (type === "url") {
			await message.replyT(decodeURIComponent(string.join(" ")));
		}
	},
	{
		description: "decode a string that was encoded",
		dirname: __dirname,
		usage: "<type> <string>",
		aliases: [],
		perms: ["EMBED_LINKS"]
	},
);
