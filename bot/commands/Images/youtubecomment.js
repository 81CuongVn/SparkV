const Discord = require(`discord.js`);
const canvacord = require(`canvacord`);

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	if (!args || !args[0]) {
		return await message.replyT(`Please provide text.`);
	}

	args = args.join(` `).slice(22);

	const User = await bot.functions.fetchUser(args[0]) || message.author;
	const Image = await canvacord.Canvas.youtube({
		username: User.username,
		avatar: User.displayAvatarURL({ format: "png" }),
		content: args,
	});

	await message.replyT({
		files: [new Discord.MessageAttachment(Image, "youtube.png")],
	});
}

module.exports = new cmd(execute, {
	description: `YouTube comment lol.`,
	aliases: ["ytcomment", "ytc"],
	dirname: __dirname,
	usage: `(user default: you) <text>`,
});
