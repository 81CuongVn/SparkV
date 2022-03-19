const Discord = require("discord.js");
const canvacord = require("canvacord");

const cmd = require("../../templates/imageCommand");

module.exports = new cmd({
	description: "Oh my, that's a very bad opinion.",
	dirname: __dirname,
	aliases: ["nofact"],
	usage: `(user) (text)`,
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 6,
			name: "user",
			description: "The user to show as a father's son saying a very bad opinion.",
			required: true
		},
		{
			type: 3,
			name: "text",
			description: "The very bad opinion that the father is very mad at.",
			required: true
		}
	],
	generate: async function(bot, message, data) {
		const user = data.options.getUser("user");
		const text = data.options.getUser("text");

		return await canvacord.Canvas.opinion(user.displayAvatarURL({ format: "png" }), text);
	}
});
