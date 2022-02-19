const Discord = require("discord.js");
const { ChaosWords } = require("weky");

const scramble = [
	"sparkv",
	"is",
	"the",
	"best",
	"bot",
	"ever"
];

const cmd = require("../../templates/command");

async function execute(bot, message) {
	await ChaosWords({
		message: message,
		embed: {
			title: "Hidden Words",
			description: "You have **{{time}}** to find the hidden words in the below sentence.",
			color: "#5865F2",
			field1: "Sentence:",
			field2: "Words Found/Remaining Words:",
			field3: "Words found:",
			field4: "Words:",
			footer: bot.config.embed.footer,
			timestamp: true
		},
		winMessage: "GG, You won! You made it in **{{time}}**.",
		loseMessage: "Better luck next time!",
		wrongWordMessage: "Wrong Guess! You have **{{remaining_tries}}** tries left.",
		correctWordMessage: "GG, **{{word}}** was correct! You have to find **{{remaining}}** more word(s).",
		time: 60000,
		words: scramble,
		charGenerated: 17,
		maxTries: 10,
		buttonText: "Cancel",
		othersMessage: "Only <@{{author}}> can use the buttons!"
	});
}

module.exports = new cmd(execute, {
	description: "Find the hidden words in a sentence.",
	usage: "",
	dirname: __dirname,
	aliases: [],
	perms: [],
});
