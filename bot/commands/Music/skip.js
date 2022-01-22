const Discord = require(`discord.js`);

const cmd = require("../../templates/musicCommand");

async function execute(bot, message, args, command, data) {
	const queue = await bot.distube.getQueue(message);

	if (!queue) return message.replyT(`${bot.config.emojis.error} | There is nothing in the queue right now!`);

	try {
		const song = queue.skip();

		await message.replyT(`${bot.config.emojis.error} | Successfully skipped! Now playing **${song.title}**.`);
	} catch (err) {
		console.error(err);
		message.replyT(`${bot.config.emojis.error} | An error occurred while skipping!`);
	}
}

module.exports = new cmd(execute, {
	description: `Skip to the next song in the queue.`,
	usage: "",
	aliases: ["nextsong", "nsong", "nexts", "next"],
	perms: ["EMBED_LINKS"],
	slash: true
});
