const Discord = require("discord.js");

const cmd = require("../../templates/musicCommand");

async function execute(bot, message, args, command, data) {
	const Queue = bot.distube.getQueue(message);

	if (!args[0]) return await message.replyT(`${bot.config.emojis.error} | Please enter a valid filter to use or to disable it (by saying off).`);

	if (args[0].toLowerCase() === "off" && Queue.filter) {
		bot.distube.setFilter(message, Queue.filter);

		return await message.replyT(`${bot.config.emojis.error} | Okay, I turned off the filter.`);
	} else if (Object.keys(bot.distube.filters).includes(args[0])) {
		bot.distube.setFilter(message, args[0]);

		return await message.replyT(`${bot.config.emojis.music} | Okay, I turned on filter ${args[0]}.`);
	} else {
		return await message.replyT(`${bot.config.emojis.error} | That's not a valid filter!`);
	}
}

module.exports = new cmd(execute, {
	description:
    "Change what the song sounds like! Filters: 3d, bassboost, echo, karaoke, nightcore, vaporwave. Requires admin to prevent abuse.",
	dirname: __dirname,
	usage: "<Filter>",
	aliases: ["setfilter"],
	perms: ["EMBED_LINKS"],
});
