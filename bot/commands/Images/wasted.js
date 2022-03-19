const Discord = require("discord.js");
const canvacord = require("canvacord");

const cmd = require("../../templates/imageCommand");

module.exports = new cmd({
	description: "W A S T E D",
	dirname: __dirname,
	aliases: ["waste"],
	usage: `(user: optional default: you)`,
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 6,
			name: "user",
			description: "The user to show the wasted text over.",
		}
	],
	generate: async function(bot, message, data) {
		const user = data.options.getUser("user") || message.user;

		return await canvacord.Canvas.wasted(user.displayAvatarURL({ format: "png" }));
	}
});
