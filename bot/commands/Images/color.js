const Discord = require("discord.js");
const canvacord = require("canvacord");

const cmd = require("@templates/command");

module.exports = new cmd({
	description: `Hex to color.`,
	aliases: [],
	dirname: __dirname,
	usage: "(hex)",
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 3,
			name: "hex",
			description: "The hex color code to show.",
		}
	],
	generate: async function(bot, message, data) {
		const hex = data.options.getString("hex");

		return await canvacord.Canvas.color(`#${hex}`);
	}
});
