const Discord = require("discord.js");
const axios = require("axios");

const cmd = require("@templates/command");

function shuffle(array) {
	let currentIndex = array.length, randomIndex;

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]];
	}

	return array;
}

async function execute(bot, message, args, command, data) {
	const difficulty = data.options.getString("difficulty") || "easy";

	const trivia = await message.replyT({
		embeds: [
			new Discord.MessageEmbed()
				.setAuthor({
					name: message.user.tag,
					iconURL: message.user.displayAvatarURL({ dynamic: true })
				})
				.setTitle(await message.translate(`${bot.config.emojis.config} | Loading...`))
				.setDescription(await message.translate(`Please wait...`))
				.setFooter({
					text: bot.config.embed.footer,
					icon_url: bot.user.displayAvatarURL({ dynamic: true })
				})
				.setColor("BLUE")
		]
	});

	const triviaData = await axios.get(`https://opentdb.com/api.php?amount=1&type=multiple&difficulty=${difficulty}`).then(res => res.data.results[0]);

	const choices = [];
	triviaData.incorrect_answers.forEach(async answer => choices.push(await message.translate(answer)));
	choices.push(await message.translate(triviaData.correct_answer));

	shuffle(choices);

	let number = 0;
	const triviaEmbed = new Discord.MessageEmbed()
		.setAuthor({
			name: message.user.tag,
			iconURL: message.user.displayAvatarURL({ dynamic: true })
		})
		.setDescription(`${bot.config.emojis.question} | **${await message.translate(triviaData.question.replaceAll("&quot;", "\""))}**\n${await message.translate("You only have")} **${await message.translate("1 minute")}** ${await message.translate("to guess the answer!")}\n\n${choices.map(choice => {
			number++;
			return `**${number}**) ${choice}`;
		}).join("\n")}`)
		.setColor(bot.config.embed.color);

	const answer1B = new Discord.MessageButton()
		.setEmoji("1️⃣")
		.setCustomId("1")
		.setStyle("SECONDARY");

	const answer2B = new Discord.MessageButton()
		.setEmoji(bot.config.emojis.numbers.two)
		.setCustomId("2")
		.setStyle("SECONDARY");

	const answer3B = new Discord.MessageButton()
		.setEmoji("3️⃣")
		.setCustomId("3")
		.setStyle("SECONDARY");

	const answer4B = new Discord.MessageButton()
		.setEmoji("4️⃣")
		.setCustomId("4")
		.setStyle("SECONDARY");

	await trivia.edit({
		embeds: [triviaEmbed],
		components: [
			{
				type: 1,
				components: [answer1B, answer2B, answer3B, answer4B]
			}
		],
		fetchReply: true
	});

	const collector = trivia.createMessageComponentCollector({
		time: 60 * 1000
	});

	collector.on("collect", async interaction => {
		await interaction.deferReply();

		const embed = new Discord.MessageEmbed()
			.setAuthor({
				name: message.user.tag,
				iconURL: message.user.displayAvatarURL({ dynamic: true })
			})
			.setTimestamp();

		const winningNumber = choices.indexOf(triviaData.correct_answer);

		if ((parseInt(interaction.customId) - 1) === winningNumber) {
			embed
				.setDescription(`${bot.config.emojis.success} | ${await message.translate("Great job! The answer was ")}**${triviaData.correct_answer}**!`)
				.setColor("GREEN");
		} else {
			embed
				.setDescription(`${bot.config.emojis.error} | ${await message.translate("That's not right... better luck next time. The answer was ")}**${triviaData.correct_answer}**.`)
				.setColor("RED");

			if ((parseInt(interaction.customId) - 1) === 0) {
				answer1B.setStyle("DANGER");
			} else if ((parseInt(interaction.customId) - 1) === 1) {
				answer2B.setStyle("DANGER");
			} else if ((parseInt(interaction.customId) - 1) === 2) {
				answer3B.setStyle("DANGER");
			} else if ((parseInt(interaction.customId) - 1) === 3) {
				answer4B.setStyle("DANGER");
			}
		}

		if (winningNumber === 0) {
			answer1B.setStyle("SUCCESS");
		} else if (winningNumber === 1) {
			answer2B.setStyle("SUCCESS");
		} else if (winningNumber === 2) {
			answer3B.setStyle("SUCCESS");
		} else if (winningNumber === 3) {
			answer4B.setStyle("SUCCESS");
		}

		await trivia.edit({
			components: [
				{
					type: 1,
					components: [answer1B.setDisabled(true), answer2B.setDisabled(true), answer3B.setDisabled(true), answer4B.setDisabled(true)]
				}
			]
		});

		await interaction.replyT({
			embeds: [embed]
		});
	});
}

module.exports = new cmd(execute, {
	description: `Play a game of trivia!`,
	dirname: __dirname,
	usage: "",
	aliases: ["questions"],
	perms: [],
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 3,
			name: "difficulty",
			description: "How hard the trivia game should be.",
			choices: [
				{
					name: "Easy",
					value: "easy"
				},
				{
					name: "Medium",
					value: "medium"
				},
				{
					name: "Hard",
					value: "hard"
				}
			]
		}
	]
});
