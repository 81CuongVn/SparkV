const Discord = require("discord.js");

const cmd = require("../../templates/imageCommand");

module.exports = new cmd({
	description: "bruh",
	dirname: __dirname,
	aliases: [],
	usage: `(user: optional default: you)`,
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 6,
			name: "user",
			description: "The user to facepalm.",
		}
	],
	generate: async function(bot, message, data) {
		const user = data.options.getUser("user") || message.user;

		return await canvacord.Canvas.facepalm(user.displayAvatarURL({ format: "png" }));
	}
});
