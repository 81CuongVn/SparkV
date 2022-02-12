const Discord = require(`discord.js`);

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	if (!args) {
		return await message.replyT(`${bot.config.emojis.error} | Bruh I cannot reverse no text lol.`);
	}

	await message.replyT(args.join(` `).split(``).reverse()
		.join(""));
}

module.exports = new cmd(execute, {
	description: `I will reverse any text you give me lol.`,
	aliases: [],
	dirname: __dirname,
	usage: `(text)`,
});
