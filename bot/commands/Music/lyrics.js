const Discord = require(`discord.js`);

const cmd = require("@templates/command");

async function execute(bot, interaction, args, command, data) {
	const query = data.options.getString("search");

	if (!query) return interaction.replyT(`${bot.config.emojis.error} | Please supply the title of a song to search for.`);

	let lyrics;
	try {
		lyrics = await (await bot.lyricsClient.songs.search(query))[0].lyrics();
	} catch (e) {
		lyrics = null;
	}

	if (!lyrics) return await interaction.replyT(`${bot.config.emojis.error} | I couldn't find the lyrics for **${query}**!`);

	const LyricsArray = lyrics.split(`\n`);
	const LyricsSubArray = [];
	const pages = [];

	let curLine = 0;
	let charCount = 0;
	let PageNumber = 0;

	for (const line of LyricsArray) {
		if ((charCount + line.length) < 650) {
			LyricsSubArray[curLine] = `${LyricsSubArray[curLine] + line}\n`;
			charCount += line.length;
		} else {
			curLine++;
			charCount = 0;
		}
	}

	LyricsSubArray.map((i, v) => {
		const SongEmbed = new Discord.EmbedBuilder()
			.setAuthor({
				name: interaction.user.tag,
				iconURL: interaction.user.displayAvatarURL({ dynamic: true })
			})
			.setTitle(query)
			.setDescription(i.replaceAll(undefined, ""))
			.setFooter({
				text: bot.config.embed.footer
			})
			.setColor(bot.config.embed.color)
			.setTimestamp();

		pages.push(SongEmbed);
	});

	const quickLeft = new Discord.ButtonBuilder()
		.setEmoji("⬅️")
		.setCustomId("quickLeft")
		.setStyle(bot.functions.getButtonStyle("SECONDARY"));

	const left = new Discord.ButtonBuilder()
		.setEmoji(bot.config.emojis.arrows.left)
		.setCustomId("left")
		.setStyle(bot.functions.getButtonStyle("SECONDARY"));

	const right = new Discord.ButtonBuilder()
		.setEmoji(bot.config.emojis.arrows.right)
		.setCustomId("right")
		.setStyle(bot.functions.getButtonStyle("SECONDARY"));

	const quickRight = new Discord.ButtonBuilder()
		.setEmoji("➡️")
		.setCustomId("quickRight")
		.setStyle(bot.functions.getButtonStyle("SECONDARY"));

	const msg = await interaction.replyT({
		embeds: [pages[0]],
		components: [new Discord.ActionRowBuilder().addComponents(quickLeft, left, right, quickRight)],
		fetchReply: true
	});

	const collector = msg.createMessageComponentCollector({
		filter: interaction => {
			if (!interaction.deferred && !interaction.customId === "LyricsMenu") interaction.deferUpdate();

			return true;
		}, time: 300 * 1000
	});

	collector.on("collect", async interaction => {
		if (interaction.customId === "quickLeft") {
			PageNumber = 0;
		} else if (interaction.customId === "left") {
			if (PageNumber > 0) {
				--PageNumber;
			} else {
				PageNumber = pages.length - 1;
			}
		} else if (interaction.customId === "right") {
			if (PageNumber + 1 < pages.length) {
				++PageNumber;
			} else {
				PageNumber = 0;
			}
		} else if (interaction.customId === "quickRight") {
			PageNumber = pages.length - 1;
		}

		try {
			interaction.edit({
				embeds: [
					pages[PageNumber].setFooter({
						text: `${bot.config.embed.footer} • Page ${PageNumber + 1}/${pages.length}`
					})
				]
			});
		} catch (err) {
			// Page deleted.
		}
	});
}

module.exports = new cmd(execute, {
	description: `Get any song's lyrics!`,
	dirname: __dirname,
	usage: "(song title or URL)",
	aliases: ["song", "verse"],
	perms: [],
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 3,
			name: "search",
			description: "The song URL or song title.",
			required: true
		}
	]
});
