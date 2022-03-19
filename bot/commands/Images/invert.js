const Discord = require("discord.js");

const cmd = require("../../templates/imageCommand");

module.exports = new cmd({
	description: "Invert the colors on somebody's avatar.",
	dirname: __dirname,
	aliases: ["flipcolor"],
	usage: `(user: optional default: you)`,
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 6,
			name: "user",
			description: "The user to invert their profile picture.",
		}
	],
	generate: async function(bot, message, data) {
		const user = data.options.getUser("user") || message.user;

		return await canvacord.Canvas.invert(user.displayAvatarURL({ format: "png" }));
	}
});
