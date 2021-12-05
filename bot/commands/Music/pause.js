const Discord = require(`discord.js`);

const cmd = require("../../templates/musicCommand");

async function execute(bot, message, args, command, data) {
	const queue = await bot.distube.getQueue(message);

	if (!queue) return await message.replyT(`${bot.config.emojis.error} | There is nothing in the queue right now! Try playing some songs.`);

	if (queue.pause) {
		queue.resume();

		return await message.replyT(`${bot.config.emojis.music} | Successfully resumed the music!`);
	}

	queue.pause();
	await message.replyT(`${bot.config.emojis.music} | Successfully paused the music!`);
}

module.exports = new cmd(execute, {
	description: `Pauses the current song playing.`,
	dirname: __dirname,
	usage: "",
	aliases: ["softstop"],
	perms: ["EMBED_LINKS"],
});
