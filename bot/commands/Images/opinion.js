const Discord = require(`discord.js`);
const canvacord = require(`canvacord`);

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	if (!args || !args[0]) {
		return await message.replyT(`Please provide text.`);
	}

	args = args.join(` `);

	const User = (await bot.functions.fetchUser(args[0])) || message.author;
	const Image = await canvacord.Canvas.opinion(User.displayAvatarURL({ format: "png" }), args);

	await message.replyT({
		files: [new Discord.MessageAttachment(Image, "opinion.png")],
	});
}

module.exports = new cmd(execute, {
	description: `lol`,
	aliases: ["nofact"],
	dirname: __dirname,
	usage: `<text>`,
});

// const Discord = require("discord.js");

// const cmd = require("../../templates/imageCommand");

// module.exports = new cmd({
// 	description: "Very bad opinion.",
// 	dirname: __dirname,
// 	aliases: ["nofact"],
// 	usage: `(text)`,
// 	effect: "opinion",
// 	useTextAndUser: true
// });
