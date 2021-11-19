const Discord = require(`discord.js`);
const EasyPages = require("discordeasypages");

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	if (!args) {
		return message
			.replyT(`${bot.config.emojis.error} | Please supply the title of a song to search for.`);
	}

	args = args.join(" ");

	const Lyrics = await require(`lyrics-finder`)(args);

	if (!Lyrics) {
		return await message.replyT(`${bot.config.emojis.error} | I couldn't find the lyrics for **${args}**!`);
	}

	if (Lyrics.length <= 2000) {
		const SongEmbed = new Discord.MessageEmbed()
			.setTitle(args)
			.setDescription(Lyrics)
			.setFooter(bot.config.embed.footer)
			.setAuthor(`Song by ${Lyrics.author}`, null, Lyrics.links.genius)
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
			.setTitle(args)
			.setDescription(x)
			.setFooter(bot.config.embed.footer)
			.setAuthor(`Song by ${Lyrics.author}`, null, Lyrics.links.genius)
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
});
