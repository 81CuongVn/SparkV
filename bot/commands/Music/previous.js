const Discord = require(`discord.js`);

const cmd = require("../../templates/musicCommand");

async function execute(bot, message, args, command, data) {
	const queue = await bot.distube.getQueue(message);

	if (!queue) return await message.replyT(`${bot.config.emojis.error} | No songs in queue.`);

	const song = queue.previous();

	await message.replyT(`${bot.config.emojis.music} | Now playing ${song.name}.`);
}

module.exports = new cmd(execute, {
	description: `Change the current track's position.`,
	dirname: __dirname,
	usage: "<number>",
	aliases: [],
	perms: ["EMBED_LINKS"],
});
