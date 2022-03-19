const Discord = require("discord.js");
const canvacord = require("canvacord");

const cmd = require("../../templates/imageCommand");

module.exports = new cmd({
	description: "Dude, calm down.",
	dirname: __dirname,
	aliases: ["mad"],
	usage: `(user: optional default: you)`,
	type: "gif",
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 6,
			name: "user",
			description: "The user to show that they are triggered.",
		}
	],
	generate: async function(bot, message, data) {
		const user = data.options.getUser("user") || message.user;

		return await canvacord.Canvas.trigger(user.displayAvatarURL({ format: "png" }));
	}
});
