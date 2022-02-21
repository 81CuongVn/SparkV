const Discord = require(`discord.js`);

const cmd = require("../../templates/command");

const words = [
	"spark",
	"bolt",
	"electromagnetic",
	"pulse"
];

module.exports = new cmd(async (bot, message, args, command, data) => {
	const chosenWord = `${words[Math.floor(Math.random() * words.length)]} ${words[Math.floor(Math.random() * words.length)]}`;
	const gameCreation = Date.now();
	const Menu = await message.replyT(`📽️ | ${message.user ? message.user : message.author} has started a spelling game!\nYou have 60 seconds to spell the following word correctly.\n> **\`${chosenWord}\`**.`);

	const Guess = await message.channel.awaitMessages({
		filter: m => {
			if (m.author.bot) return false;
			if (m.content.toLowerCase() === chosenWord.toLowerCase()) {
				return true;
			} else {
				m.reply("Nice try, but you didn't spell the word correctly!");

				return false;
			}
		},
		max: 1,
		time: 60 * 1000,
		errors: ["time"],
	}).then(async collected => {
		const colMessage = collected.first();
		const seconds = ((Date.now() - gameCreation) / 1000 % 60).toFixed(2);

		await Menu.edit(`${Menu.content}\n\n🎉 | ${colMessage.author} has won the game in **${seconds} seconds**!`);
		await message.replyT(`🥇 ${colMessage.author} got it right in **${seconds} seconds**!`);
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
});
