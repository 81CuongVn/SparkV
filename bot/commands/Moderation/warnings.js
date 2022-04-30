const Discord = require("discord.js");

const cmd = require("@templates/modCommand");

const emojis = [
	"⬅️",
	bot.config.emojis.arrows.left,
	bot.config.emojis.arrows.right,
	"➡️"
];

async function execute(bot, message, args, command, data) {
	const User = message?.applicationId ? (data.options.getMember("user") || message.user) : (message.mentions.members.first() || message.author);
	const UserData = (User.user ? User.user.id : User.id) === (message.user ? message.user.id : message.author.id) ? data.member : await bot.database.getMember(User.user ? User.user.id : User.id, message.guild.id);

	console.log(UserData);
	if (!User) return await message.replyT(`${bot.config.emojis.error} | Please mention someone to view their warnings!`);

	if (!UserData.infractionsCount === 0) return await message.replyT("This user doesn't have any infractions!");
	if (UserData.infractionsCount >= 100) return await message.replyT("This user has over 100 infractions!");

	const infractions = UserData.infractions.sort((a, b) => b.date - a.date).map(infraction => `**${infraction.type}** - <t:${~~(infraction.date / 1000)}:R>`).join("\n");

	const WarningsArray = infractions.split(`\n`);
	const WarningsSubArray = [];
	const pages = [];

	let curLine = 0;
	let charCount = 0;
	let PageNumber = 0;

	for (const line of WarningsArray) {
		if ((charCount + line.length) < 500) {
			WarningsSubArray[curLine] = `${WarningsSubArray[curLine] + line}\n`;
			charCount += line.length;
		} else {
			curLine++;
			charCount = 0;
		}
	}

	WarningsSubArray.map((i, v) => {
		const SongEmbed = new Discord.MessageEmbed()
			.setAuthor({
				name: `${(User.user ? User.user : User).tag}'s Warning${UserData.infractionsCount > 1 ? "s" : ""}`,
				iconURL: (User.user ? User.user : User).displayAvatarURL({ dynamic: true })
			})
			.setDescription(`${User} has **${UserData.infractionsCount}** warning${UserData.infractionsCount > 1 ? "s" : ""}\n\n${i}`)
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
		.setStyle("SECONDARY");

	const left = new Discord.MessageButton()
		.setEmoji(emojis[1])
		.setCustomId("left")
		.setStyle("SECONDARY");

	const right = new Discord.MessageButton()
		.setEmoji(emojis[2])
		.setCustomId("right")
		.setStyle("SECONDARY");

	const quickRight = new Discord.MessageButton()
		.setEmoji(emojis[3])
		.setCustomId("quickRight")
		.setStyle("SECONDARY");

	const msg = await message.replyT({
		embeds: [pages[0]],
		components: [new Discord.MessageActionRow().addComponents(quickLeft, left, right, quickRight)],
		fetchReply: true
	});

	const collector = msg.createMessageComponentCollector({
		filter: interaction => {
			if (!interaction.deferred) interaction.deferUpdate();

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
	description: `I'll display a user's warnings.`,
	dirname: __dirname,
	aliases: ["infractions"],
	usage: `(user)`,
	perms: ["MODERATE_MEMBERS"],
	bot_perms: ["MODERATE_MEMBERS"],
	slash: true,
	options: [
		{
			type: 6,
			name: "user",
			description: "The user to display the warnings of.",
		}
	]
});
