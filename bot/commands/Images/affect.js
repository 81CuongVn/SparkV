const Discord = require("discord.js");
const canvacord = require("canvacord");

const cmd = require("../../templates/imageCommand");

module.exports = new cmd({
	description: "This won't affect my child at all!",
	dirname: __dirname,
	aliases: [],
	usage: `(user: optional default: you)`,
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 6,
			name: "user",
			description: "The user.",
		}
	],
	generate: async function(bot, message, data) {
		const user = data.options.getUser("user") || message.user;

		return await canvacord.Canvas.affect(user.displayAvatarURL({ format: "png" }));
	}
});
