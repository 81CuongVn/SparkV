const Discord = require(`discord.js`);
const { Trivia } = require("weky");

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	if (args[0]) {
		if (!args[0] === "easy" || !args[0] === "medium" || !args[0] === "hard") {
			args[0] = "easy";
		}
	}

	await Trivia({
		message: message,
		embed: {
			title: "Trivia",
			description: "You only have **{{time}}** to guess the answer!",
			footer: bot.config.embed.footer,
			color: "#7289da",
			timestamp: true,
		},
		difficulty: args[0] || "easy",
		thinkMessage: "Loading",
		winMessage: "It was **{{answer}}**. You gave the correct answer in **{{time}}**.",
		loseMessage: "Better luck next time! The correct answer was **{{answer}}**.",
		emojis: {
			one: "1️⃣",
			two: "2️⃣",
			three: "3️⃣",
			four: "4️⃣",
		},
		othersMessage: "Only <@{{author}}> can use the buttons!",
		returnWinner: false,
	});
}

module.exports = new cmd(execute, {
	description: `Play a game of trivia!`,
	dirname: __dirname,
	usage: "",
	aliases: ["questions"],
	perms: [],
});
