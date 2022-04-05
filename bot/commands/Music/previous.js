const Discord = require(`discord.js`);

const cmd = require("@templates/musicCommand");

async function execute(bot, message, args, command, data) {
	const queue = await bot.distube.getQueue(message);

	if (!queue) return await message.replyT(`${bot.config.emojis.error} | No songs in queue.`);
	if (!queue.previousSongs || queue.previousSongs.length === 0) return await message.replyT(`${bot.config.emojis.error} | There are no previous songs.`);

	const song = queue.previous();

	await message.replyT(`${bot.config.emojis.music} | Now playing ${song.name}.`);
}

module.exports = new cmd(execute, {
	description: "Go back to the song that was playing before the current one.",
	dirname: __dirname,
	usage: "",
	aliases: [],
	perms: [],
	slash: true
});
