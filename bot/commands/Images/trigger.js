const Discord = require("discord.js");
const canvacord = require("canvacord");

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	const User = (await bot.functions.fetchUser(args[0])) || message.author;
	const Image = await canvacord.Canvas.trigger(User.displayAvatarURL({ dynamic: true }));

	await message.replyT({
		files: [new Discord.MessageAttachment(Image, "trigger.gif")],
	});
}

module.exports = new cmd(execute, {
	description: "wow you mad bro",
	aliases: ["mad"],
	dirname: __dirname,
	usage: `(user default: you)`,
});
