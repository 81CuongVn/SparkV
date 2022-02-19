const Discord = require("discord.js");
const { LieSwatter } = require("weky");

const cmd = require("../../templates/command");

async function execute(bot, message) {
	await LieSwatter({
		message: message,
		embed: {
			title: "Lie Swatter",
			color: "#5865F2",
			footer: bot.config.embed.footer,
			timestamp: true,
		},
		thinkMessage: "Loading",
		winMessage: "Great job! It was **{{answer}}**. You got it correct in **{{time}}**.",
		loseMessage: "Awwww. You choose the wrong answer. It was **{{answer}}**.",
		othersMessage: "Only <@{{author}}> can use the buttons!",
		buttons: { true: "Truth", lie: "Lie" },
	});
}

module.exports = new cmd(execute, {
	description: "Play a game of Lie Swatter! Choose which is the truth, or a lie.",
	usage: "",
	dirname: __dirname,
	aliases: [],
	perms: [],
});
