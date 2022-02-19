const Discord = require("discord.js");

const cmd = require("../../templates/musicCommand");

async function execute(bot, message, args, command, data) {
	const query = message?.applicationId ? data.options.get("search").value : args.join(" ");

	if (!query) return await message.replyT(`${bot.config.emojis.error} | Please enter a song URL or query to search!`);

	bot.distube.play(message.member.voice.channel, query, {
		textChannel: message.channel,
	});

	return await message.replyT(`${bot.config.emojis.search} | Searching for **${query}**...`);
}

module.exports = new cmd(execute, {
	description: "Plays a song with the given name or URL.",
	dirname: __dirname,
	usage: "<song title or URL>",
	aliases: ["p"],
	perms: [],
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
