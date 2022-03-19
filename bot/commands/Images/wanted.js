const Discord = require("discord.js");
const canvacord = require("canvacord");

const cmd = require("../../templates/imageCommand");

module.exports = new cmd({
	description: "Create a wanted poster.",
	dirname: __dirname,
	aliases: ["wsign", "wanteds"],
	usage: `(user: optional default: you)`,
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 6,
			name: "user",
			description: "The user to show a wanted poster about.",
		}
	],
	generate: async function(bot, message, data) {
		const user = data.options.getUser("user") || message.user;

		return await canvacord.Canvas.wanted(user.displayAvatarURL({ format: "png" }));
	}
});
