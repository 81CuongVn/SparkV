const Discord = require("discord.js");
const canvacord = require("canvacord");

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	const User = (await bot.functions.fetchUser(args[0])) || message.author;
	const Image = await canvacord.Canvas.shit(User.displayAvatarURL({ format: "png" }));

	await message.replyT({
		files: [new Discord.MessageAttachment(Image, "shit.png")],
	});
}

module.exports = new cmd(execute, {
	description: "Ew!",
	aliases: ["crap"],
	dirname: __dirname,
	usage: `(user default: you)`,
});
