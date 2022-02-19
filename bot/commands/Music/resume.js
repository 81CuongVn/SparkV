const Discord = require(`discord.js`);

const cmd = require("../../templates/musicCommand");

async function execute(bot, message, args, command, data) {
	const queue = await bot.distube.getQueue(message);

	if (!queue) return await message.replyT(`${bot.config.emojis.error} | No songs was ever/still is paused.`);

	if (queue.playing) {
		queue.pause();

		await message.replyT(`${bot.config.emojis.music} | Successfully paused the music!`);
	}

	queue.resume();
	await message.replyT(`${bot.config.emojis.music} | Successfully resumed the music. Enjoy!`);
}

module.exports = new cmd(execute, {
	description: `Resume playing the current song.`,
	dirname: __dirname,
	usage: "",
	aliases: ["unpause"],
	perms: [],
	slash: true
});
