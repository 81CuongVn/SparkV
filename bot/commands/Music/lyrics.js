const Discord = require(`discord.js`);

const cmd = require("../../templates/command");

const emojis = [
	"⬅️",
	"◀️",
	"#️⃣",
	"▶️",
	"➡️"
];

async function execute(bot, interaction, args, command, data) {
	const query = data.options.getString("search");

	if (!query) return interaction.replyT(`${bot.config.emojis.error} | Please supply the title of a song to search for.`);

	const Lyrics = await require(`lyrics-finder`)(query);

	if (!Lyrics) return await interaction.replyT(`${bot.config.emojis.error} | I couldn't find the lyrics for **${query}**!`);

	const LyricsArray = Lyrics.split(`\n`);
	const LyricsSubArray = [];
	const pages = [];

	let curLine = 0;
	let charCount = 0;
	let PageNumber = 0;

	for (const line of LyricsArray) {
		if ((charCount + line.length) < 500 && LyricsSubArray[curLine]) {
			LyricsSubArray[curLine] = `${LyricsSubArray[curLine] + line}\n`;
			charCount += line.length;
		} else {
			curLine++;
			charCount = 0;
		}
	}

	LyricsSubArray.map((i, v) => {
		const SongEmbed = new Discord.MessageEmbed()
			.setAuthor({
				name: interaction.user.tag,
				iconURL: interaction.user.displayAvatarURL({ dynamic: true })
			})
			.setTitle(query)
			.setDescription(i)
			.setFooter({
				text: bot.config.embed.footer
			})
			.setColor(bot.config.embed.color)
			.setTimestamp();

		pages.push(SongEmbed);
	});

	const quickLeft = new Discord.MessageButton()
		.setEmoji(emojis[0])
		.setCustomId("quickLeft")
		.setStyle("PRIMARY");

	const left = new Discord.MessageButton()
		.setEmoji(emojis[1])
		.setCustomId("left")
		.setStyle("PRIMARY");

	const number = new Discord.MessageButton()
		.setEmoji(emojis[2])
		.setCustomId("number")
		.setStyle("PRIMARY");

	const right = new Discord.MessageButton()
		.setEmoji(emojis[3])
		.setCustomId("right")
		.setStyle("PRIMARY");

	const quickRight = new Discord.MessageButton()
		.setEmoji(emojis[4])
		.setCustomId("quickRight")
		.setStyle("PRIMARY");

	const msg = await interaction.replyT({
		embeds: [pages[0]],
		components: [new Discord.MessageActionRow().addComponents(quickLeft, left, number, right, quickRight)],
		fetchReply: true
	});

	const collector = msg.createMessageComponentCollector({
		filter: interaction => {
			if (!interaction.deferred && !interaction.customId === "LyricsMenu") interaction.deferUpdate();

			return true;
		}, time: 300 * 1000
	});

	collector.on("collect", async interaction => {
		if (interaction.customId) {
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
			} else if (interaction.customId === "number") {
				const infoMsg = await interaction.replyT("Please send a page number.");

				await interaction.channel.awaitMessages({
					filter: msg => {
						if (msg.author.id === msg.client.user.id) return false;

						if (!msg.content) {
							msg.replyT("Please send a number!");

							return false;
						}

						if (!parseInt(msg.content) && isNaN(msg.content)) {
							msg.replyT("Please send a valid number!");

							return false;
						}

						if (parseInt(msg.content) > pages.length) {
							msg.replyT("That's a page number higher than the amount of pages there are.");

							return false;
						}

						return true;
					}, max: 1, time: 30 * 1000, errors: ["time"]
				}).then(async collected => {
					const input = parseInt(collected.first().content);

					PageNumber = input - 1;
					collected.first().delete().catch(err => { });
					infoMsg.delete().catch(err => { });
				}).catch(async collected => await interaction.replyT("Canceled due to no valid response within 30 seconds."));
			} else {
				return;
			}
		}

		try {
			interaction.update({
				embeds: [
					pages[PageNumber].setFooter({
						text: `${bot.config.embed.footer} • Page ${PageNumber + 1}/${pages.length}`
					})
				],
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
	perms: ["EMBED_LINKS"],
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
