const Discord = require(`discord.js`);

const cmd = require("../../templates/musicCommand");

async function execute(bot, message, args, command, data) {
	const queue = await bot.distube.getQueue(message);

	if (!queue) return await message.replyT(`${bot.config.emojis.error} | No songs was ever/still is paused.`);
	if (!args[0]) return await message.replyT(`${bot.config.emojis.error} | Please provide a position, in seconds, to seek!`);

	const position = Number(args[0]);

	if (isNaN(position)) return await message.replyT(`${bot.config.emojis.error} | Please provide a **VALID** position, in seconds, to seek!`);

	queue.seek(position);
	await message.replyT(`${bot.config.emojis.music} | Okay, I set the track's position to ${position}.`);
}

module.exports = new cmd(execute, {
	description: `Change the current track's position.`,
	dirname: __dirname,
	usage: "<number>",
	aliases: [],
	perms: ["EMBED_LINKS"],
});
