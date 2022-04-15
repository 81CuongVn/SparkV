const Discord = require("discord.js");
const axios = require("axios");
const RandomWord = require("random-words");
const akinator = require("discord.js-akinator");

const cmd = require("@templates/gameCommand");

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
	const type = data.options.getString("type");

	if (type === "hangman") {
		const word = RandomWord();
		const lettersRegExp = new RegExp(`^[A-Za-zÀ-ú](?:.{0}|.{${word.length - 1}})$`);

		let menuEmbed;

		let gameOver = false;
		let gameStatus = "playing";

		let progress = "_".repeat(word.length);
		let lives = 6;
		let remaining = word.length;
		const misses = [];

		// eslint-disable-next-line no-inner-declarations
		async function updateGame() {
			const embed = new Discord.MessageEmbed()
				.setAuthor({
					name: (message.user ? message.user : message.author).tag,
					iconURL: (message.user ? message.user : message.author).displayAvatarURL({ dynamic: true })
				})
				.setTitle(await message.translate("Hangman"))
				.setDescription(`\`\`\`
        +--+
        |  |
        |  ${lives < 6 ? "0" : " "}
        | ${lives < 3 ? "/" : " "}${lives < 5 ? "|" : " "}${lives < 4 ? "\\" : " "}
        | ${lives < 2 ? "/" : " "} ${lives < 1 ? "\\" : " "}
        |
    ---------
			\`\`\`\n${gameOver ? `${(gameStatus === await message.translate("won") ? await message.translate("You won!") : await message.translate("You lost. Better luck next time."))} ${await message.translate("The word was")} \`${word}\`` : await message.translate("You got this!")}`)
				.addField(await message.translate("Word"), `\`${progress}\``, false)
				.addField(await message.translate("Guesses"), `${misses.join(", ") || "None."}`, true)
				.addField(await message.translate("Lives"), `${"❤️".repeat(lives >= 0 ? lives : 0)}${"🖤".repeat(6 - lives)}`, true)
				.setColor(gameOver ? (gameStatus === "won" ? "GREEN" : "RED") : "BLUE");

			if (menuEmbed) {
				await menuEmbed.edit({
					embeds: [embed]
				});
			} else {
				menuEmbed = await message.replyT({
					embeds: [embed]
				});
			}
		}

		await updateGame();

		const collector = await menuEmbed.channel.createMessageCollector({
			filter: m => m.content,
			time: 900 * 1000,
		});

		collector.on("collect", async m => {
			if (m.content.toLowerCase() === "cancel") await collector.stop();
			if (!m.content.match(lettersRegExp)) return;

			const guess = m.content.toLowerCase();

			if (guess.length === 1) {
				if (misses.includes(`\`${guess}\``)) {
					await m.replyT(`\`${guess}\` ${await message.translate("has already been guessed. Try again!")}`).then(async m => setTimeout(() => m.delete(), 5000));

					return setTimeout(() => m.delete(), 5000);
				}

				if (word.includes(guess)) {
					for (let i = 0; i < word.length; ++i) {
						if (word[i] === guess) {
							progress = `${progress.substring(0, i)}${word[i]}${progress.substring(i + word[i].length)}`;
							remaining--;
						}
					}
				} else {
					if (!misses.includes(guess)) misses.push(`\`${guess}\``);
					lives--;
				}

				if (lives === 0) {
					gameStatus = "lost";
				} else if (remaining === 0) {
					gameStatus = "won";
				}

				m.delete();
			}

			await updateGame();

			if (gameStatus !== "playing") {
				await collector.stop();
			}
		});

		collector.on("end", async collected => {
			gameOver = true;
			await updateGame();
		});
	} else if (type === "spelling") {
		const chosenWord = RandomWord({ exactly: 2, wordsPerString: 2, join: " " });
		const gameCreation = Date.now();

		const MenuEmbed = new Discord.MessageEmbed()
			.setAuthor({
				name: (message.user ? message.user : message.author).tag,
				iconURL: (message.user ? message.user : message.author).displayAvatarURL({ dynamic: true })
			})
			.setDescription(`**Spelling Game**\nYou have **1 minute** to spell the following word correctly.\n> **\`${chosenWord}\`**.`)
			.setColor(bot.config.embed.color)
			.setTimestamp();

		const Menu = await message.replyT({
			embeds: [MenuEmbed]
		});

		const Guess = await message.channel.awaitMessages({
			filter: m => {
				if (m.author.bot) return false;
				if (!m?.content) return false;

				return true;
			},
			max: 1,
			time: 60 * 1000,
			errors: ["time"],
		}).then(async collected => {
			const colMessage = collected.first();
			const embed = new Discord.MessageEmbed()
				.setAuthor({
					name: (message.user ? message.user : message.author).tag,
					iconURL: (message.user ? message.user : message.author).displayAvatarURL({ dynamic: true })
				})
				.setTimestamp();

			if (colMessage.content.toLowerCase() === chosenWord.toLowerCase()) {
				const time = ((Date.now() - gameCreation) / 1000);
				const seconds = (time % 60).toFixed(2);
				const WPM = (colMessage.content.toLowerCase().trim().length / 5 / (time / 60)).toFixed(2);

				await Menu.edit({
					embeds: [
						MenuEmbed
							.setDescription(`${MenuEmbed.description}\n\n${bot.config.emojis.success} | ${colMessage.author} ${await message.translate("has won the game in")} **${seconds} ${await message.translate("seconds")}** ${await message.translate("with a WPM of ")}**${WPM}**!`)
							.setColor("GREEN")
					]
				});

				embed
					.setDescription(`${bot.config.emojis.success} | ${await message.translate("Great job! The answer was ")}\`${chosenWord}\`. You got it right in **${seconds} seconds** with a WPM of **${WPM}**!`)
					.setColor("GREEN");
			} else {
				await Menu.edit({
					embeds: [
						MenuEmbed
							.setDescription(`${MenuEmbed.description}\n\n${bot.config.emojis.error} | ${colMessage.author} ${await message.translate("spelt the word wrong, and lost the game")}.`)
							.setColor("RED")
					]
				});

				embed
					.setDescription(`${bot.config.emojis.error} | ${await message.translate("That's not right... better luck next time. The words were ")}\`${chosenWord}\`.`)
					.setColor("RED");
			}

			await message.replyT({
				embeds: [embed]
			});
		}).catch(err => {
			bot.logger(err, "error");

			message.replyT("⏰ | The game has been cancelled because nobody replied in time.");
		});
	} else if (type === "trivia") {
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

		const triviaData = await axios.get(`https://opentdb.com/api.php?amount=1&type=multiple&"easy"=${"easy"}`).then(res => res.data.results[0]);

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
	} else if (type === "akinator") {
		const gameTypes = ["animal", "character", "object"];

		message.replyT("What type of akinator game would you like to play? You can play animal, character or object. Type cancel to stop.").then(async () => {
			await message.channel.awaitMessages({ filter: async m => {
				if (m.author.id === m.client.user.id) return false;

				if (m.content) {
					if (m.content.length > 35) {
						await m.replyT(`${bot.config.emojis.error} | The game type cannot be longer than 35 characters.`);

						return false;
					}

					if (m.content.toLowerCase("cancel")) return true;

					if (!gameTypes.includes(m.content.toLowerCase())) {
						await m.replyT(`${bot.config.emojis.error} | The game type must be one of the following: ${gameTypes.join(", ")}`);

						return false;
					}

					return true;
				} else {
					await m.replyT("Dude... I need you to send a valid message.");
					return false;
				}
			}, max: 1, time: 30 * 1000, errors: ["time"] }).then(async collected => {
				const gameType = collected.first().content.toLowerCase();

				if (gameType === "cancel") return await message.replyT("Alright, I won't create an akinator game.");

				await message.replyT(`Alright, let's play akinator ${gameType}! Loading...`).then(async () => {
					akinator(message, {
						gameType,
						useButtons: true,
						language: data.guild.language
					});
				});
			}).catch(async collected => await message.replyT("Canceled due to no valid response within 30 seconds."));
		});
	}
}

module.exports = new cmd(execute, {
	description: "Play a game with SparkV.",
	usage: "",
	dirname: __dirname,
	aliases: [],
	perms: [],
	type: "normal",
	slash: true,
	options: [
		{
			type: 3,
			name: "type",
			description: "What type of game to play.",
			required: true,
			choices: [
				{
					name: "hangman",
					value: "hangman"
				},
				{
					name: "trivia",
					value: "trivia"
				},
				{
					name: "spelling",
					value: "spelling"
				},
				{
					name: "akinator",
					value: "akinator"
				}
			]
		}
	]
});
