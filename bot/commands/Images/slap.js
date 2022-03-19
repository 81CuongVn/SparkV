const Discord = require("discord.js");

const cmd = require("../../templates/imageCommand");

module.exports = new cmd({
	description: "Damn. That's a hard slap!",
	dirname: __dirname,
	aliases: ["attack"],
	usage: `(user: optional default: you) (user: optional default: you)`,
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 6,
			name: "user",
			description: "The user who is slapping the other user. Leave blank to be you.",
		},
		{
			type: 6,
			name: "user2",
			description: "The user who is getting slapped."
		}
	],
	generate: async function(bot, message, data) {
		const user = data.options.getUser("user") || message.user;
		const user2 = data.options.getUser("user2") || message.user;

		return await canvacord.Canvas.slap(user.displayAvatarURL({ format: "png" }), user2.displayAvatarURL({ format: "png" }));
	}
});
