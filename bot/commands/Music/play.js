const Discord = require("discord.js");

const cmd = require("../../templates/musicCommand");

async function execute(bot, message, args, command, data) {
	const query = args.join(" ");

	if (!query) return await message.replyT(`${bot.config.emojis.error} | Please enter a song URL or query to search!`);

	try {
		bot.distube.play(message, query);
	} catch (err) {
		console.error(err);

		await message.replyT(`${bot.config.emojis.error} | Uh oh! An error occured.`);
	}
}

module.exports = new cmd(execute, {
	description: "Plays a song with the given name or URL.",
	dirname: __dirname,
	usage: "<song title or URL>",
	aliases: ["p"],
	perms: ["EMBED_LINKS"],
});
