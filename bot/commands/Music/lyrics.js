const Discord = require(`discord.js`);
const EasyPages = require("discordeasypages");

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	const query = message?.applicationId ? data.options.get("search").value : args.join(" ");

	if (!query) return message.replyT(`${bot.config.emojis.error} | Please supply the title of a song to search for.`);

	const Lyrics = await require(`lyrics-finder`)(query);

	if (!Lyrics) return await message.replyT(`${bot.config.emojis.error} | I couldn't find the lyrics for **${query}**!`);

	if (Lyrics.length <= 2000) {
		const SongEmbed = new Discord.MessageEmbed()
			.setTitle(query)
			.setDescription(Lyrics)
			.setFooter({
				text: bot.config.embed.footer
			})
			.setAuthor({
				name: `${Lyrics.author}`,
				url: Lyrics.links.genius
			})
			.setColor(bot.config.embed.color)
			.setTimestamp();

		return await message.replyT({
			embeds: [SongEmbed],
		});
	}

	const LyricsArray = Lyrics.split(`\n`);
	const LyricsSubArray = [];
	const pages = [];
	let e = 0;

	for (const line of LyricsArray) {
		if (LyricsSubArray[e].length + line.length < 2000) {
			LyricsSubArray[e] = `${LyricsSubArray[e] + line}\n`;
		} else {
			e++;
			LyricsSubArray.push(line);
		}
	}

	const CreatePage = (bot, Message, x) => {
		const SongEmbed = new Discord.MessageEmbed()
			.setTitle(query)
			.setDescription(x)
			.setFooter({
				text: bot.config.embed.footer
			})
			.setAuthor({
				name: `${Lyrics.author}`,
				url: Lyrics.links.genius
			})
			.setColor(bot.config.embed.color)
			.setTimestamp();

		LyricsSubArray.map((x, i) => CreatePage(bot, message, x));
		EasyPages(message, Pages, ["⬅", "➡"]);
	};
}

module.exports = new cmd(execute, {
	description: `Get any song's lyrics!`,
	dirname: __dirname,
	usage: "<song title or URL>",
	aliases: ["song", "verse"],
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
