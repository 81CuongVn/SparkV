const Discord = require("discord.js");
const canvacord = require("canvacord");

const cmd = require("../../templates/imageCommand");

module.exports = new cmd({
	description: "OH NO! HE'S STUPID!",
	dirname: __dirname,
	aliases: ["studpid"],
	usage: `(text)`,
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 6,
			name: "text",
			description: "The text to make the dog in the meme say.",
			required: true
		}
	],
	generate: async function(bot, message, data) {
		const user = data.options.getUser("text");

		return await canvacord.Canvas.ohno(text);
	}
});
