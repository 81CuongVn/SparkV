const Discord = require("discord.js");
const canvacord = require("canvacord");

const cmd = require("../../templates/command");

async function execute(bot, message, args) {
	const User2 = await bot.functions.fetchUser(args[0]) || message.author;
	const Image = await canvacord.Canvas.slap(
		message.author.displayAvatarURL({ format: "png" }),
		User2.displayAvatarURL({ format: "png" }),
	);

	await message.replyT({
		files: [new Discord.MessageAttachment(Image, "slap.png")],
	});
}

module.exports = new cmd(execute, {
	description: "SLAP SLAP SLAP!",
	aliases: ["punch"],
	dirname: __dirname,
	usage: `(user default: you)`,
});
