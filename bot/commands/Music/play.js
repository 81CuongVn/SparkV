const Discord = require("discord.js");

const cmd = require("../../templates/musicCommand");

async function execute(bot, message, args, command, data) {
	const query = message?.applicationId ? data.options.get("search").value : args.join(" ");

	if (!query) return await message.replyT(`${bot.config.emojis.error} | Please enter a song URL or query to search!`);

	try {
		bot.distube.play(message.member.voice.channel, query, {
			textChannel: message.channel,
		});

		await message.replyT(`${bot.config.emojis.success} | Now playing: ${query}`);
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
	slash: true,
	options: [
		{
			type: 3,
			name: "search",
			description: "The song URL or song title.",
			required: true
		}
	]
});
