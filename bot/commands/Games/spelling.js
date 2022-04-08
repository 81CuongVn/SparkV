const Discord = require("discord.js");
const randomWords = require("random-words");

const cmd = require("@templates/command");

module.exports = new cmd(async (bot, message, args, command, data) => {
	const difficulty = parseInt(data?.options?.getString("difficulty")) || 2;
	const chosenWord = randomWords({ exactly: 2, wordsPerString: difficulty, join: " " });
	const gameCreation = Date.now();
	const Menu = await message.replyT(`📽️ | ${message.user ? message.user : message.author} has started a spelling game!\nYou have 60 seconds to spell the following word correctly.\n> **\`${chosenWord}\`**.`);

	const Guess = await message.channel.awaitMessages({
		filter: m => {
			if (m.author.bot) return false;
			if (m.content.toLowerCase() === chosenWord.toLowerCase()) {
				return true;
			} else {
				m.replyT("Nice try, but you didn't spell the word correctly!");

				return false;
			}
		},
		max: 1,
		time: 60 * 1000,
		errors: ["time"],
	}).then(async collected => {
		const colMessage = collected.first();
		const time = ((Date.now() - gameCreation) / 1000);
		const seconds = (time % 60).toFixed(2);
		const WPM = (colMessage.content.toLowerCase().trim().length / 5 / (time / 60)).toFixed(2);

		await Menu.edit(`${Menu.content}\n\n${await message.translate("🎉 | ")}${colMessage.author}${await message.translate(" has won the game in ")}**${seconds} ${await message.translate("seconds")}** ${await message.translate("with a WPM of ")}**${WPM}**!`);
		await message.replyT(`🥇 ${colMessage.author} got it right in **${seconds} seconds** with a WPM of **${WPM}**!`);
	}).catch(err => {
		bot.logger(err, "error");

		message.replyT("⏰ | The game has been cancelled because nobody replied in time.");
	});
}, {
	description: "Challenge your friends to a spelling game!",
	dirname: __dirname,
	aliases: [],
	usage: "",
	slash: true,
	options: [
		{
			type: 3,
			name: "difficulty",
			description: "How hard the spelling game should be.",
			choices: [
				{
					name: "Easy",
					value: "2"
				},
				{
					name: "Medium",
					value: "5"
				},
				{
					name: "Hard",
					value: "10"
				},
				{
					name: "Extreme",
					value: "15"
				},
				{
					name: "Super Extreme",
					value: "20"
				}
			]
		}
	]
});
