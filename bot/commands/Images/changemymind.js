const Discord = require("discord.js");

const cmd = require("../../templates/imageCommand");

module.exports = new cmd({
	description: "The \"Change my mind\" meme.",
	dirname: __dirname,
	aliases: ["cmm"],
	usage: `(text)`,
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 6,
			name: "text",
			description: "The text to change my mind about.",
			required: true
		}
	],
	generate: async function(bot, message, data) {
		const text = data.options.getUser("text");

		return await canvacord.Canvas.changemymind(text);
	}
});
