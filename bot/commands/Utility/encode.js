const os = require("os");
const Discord = require("discord.js");

const cmd = require("../../templates/command");

module.exports = new cmd(
	async (bot, message, args) => {
		if (!args) return await message.replyT("Next time, choose the type of encoding and the text to encode. Types: `base64`, `hex` or `url`");

		const [type, ...string] = args;

		if (type === "base64") {
			await message.replyT(Buffer.from(string.join(" ")).toString("base64"));
		} else if (type === "hex") {
			const h = Buffer.from(string.join(" ")).toString("base64");
			const e = Buffer.from(h, "base64");

			await message.replyT(e.toString("hex"));
		} else if (type === "url") {
			await message.replyT(encodeURIComponent(string.join(" ")));
		}
	},
	{
		description: "encode a string",
		dirname: __dirname,
		usage: "<type> <string>",
		aliases: [],
		perms: ["EMBED_LINKS"]
	},
);
