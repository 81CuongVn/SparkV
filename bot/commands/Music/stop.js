const Discord = require(`discord.js`);

const cmd = require("../../templates/musicCommand");

async function execute(bot, message, args, command, data) {
	const queue = await bot.distube.getQueue(message);

	if (!queue) return message.replyT(`${bot.config.emojis.error} | There is nothing in the queue right now!`);

	queue.stop();
	await message.replyT(`${bot.config.emojis.error} | Successfully stopped the queue!`);
}

module.exports = new cmd(execute, {
	description: `Disconnects me from the voice channel and removes all songs in queue.`,
	dirname: __dirname,
	usage: "",
	aliases: ["disconnect", "leave"],
	perms: [],
	slash: true
});
