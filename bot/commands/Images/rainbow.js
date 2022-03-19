const Discord = require("discord.js");
const canvacord = require("canvacord");

const cmd = require("../../templates/imageCommand");

module.exports = new cmd({
	description: "Damn, you really like rainbows.",
	dirname: __dirname,
	aliases: [],
	usage: `(user: optional default: you)`,
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 6,
			name: "user",
			description: "The user to show a rainbow over.",
		}
	],
	generate: async function(bot, message, data) {
		const user = data.options.getUser("user") || message.user;

		return await canvacord.Canvas.rainbow(user.displayAvatarURL({ format: "png" }));
	}
});
