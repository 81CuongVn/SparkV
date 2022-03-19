const Discord = require("discord.js");

const cmd = require("../../templates/imageCommand");

module.exports = new cmd({
	description: "Why do you hate me, brother?",
	dirname: __dirname,
	aliases: ["underbed"],
	usage: `(user: optional default: you) (user: optional default: you)`,
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

		return await canvacord.Canvas.bed(message.author.displayAvatarURL({ format: "png" }), user.displayAvatarURL({ format: "png" }));
	}
});
