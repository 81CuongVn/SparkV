const Discord = require(`discord.js`);

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	if (!args || !args[0]) {
		return await message.replyT(`Please provide a valid HEX color code. Example: #ff0000.`);
	}

	const canvacord = require(`canvacord`);

	args = args.join(` `);

	const Image = await canvacord.Canvas.color(`#${args}`);
	const Color = new Discord.MessageAttachment(Image, `color.png`);

	await message.replyT({
		files: [Color],
	});
}

module.exports = new cmd(execute, {
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
