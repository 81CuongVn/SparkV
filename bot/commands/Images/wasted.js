const Discord = require("discord.js");
const canvacord = require("canvacord");

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	const User = (await bot.functions.fetchUser(args[0])) || message.author;
	const Image = await canvacord.Canvas.wasted(User.displayAvatarURL({ format: "png" }));

	await message.replyT({
		files: [new Discord.MessageAttachment(Image, "wasted.png")],
	});
}

module.exports = new cmd(execute, {
	description: "Dang man, that's a life wasted.",
	aliases: ["waste"],
	dirname: __dirname,
	usage: `(user default: you)`,
});
