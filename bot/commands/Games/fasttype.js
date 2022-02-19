const Discord = require("discord.js");
const { FastType } = require("weky");

const cmd = require("../../templates/command");

async function execute(bot, message) {
	await FastType({
		message: message,
		embed: {
			title: "FastType",
			description: "You have **{{time}}** to type the below sentence.",
			color: "#5865F2",
			footer: bot.config.embed.footer,
			timestamp: true,
		},
		sentence: "SparkV is the best Discord bot ever!",
		winMessage: "GG, you have a wpm of **{{wpm}}** and You made it in **{{time}}**.",
		loseMessage: "You lost. Better luck next time!\n\nTIP: Make sure you're typing out a sentence.",
		cancelMessage: "You ended the game!",
		time: 60 * 1000,
		buttonText: "Cancel",
		othersMessage: "Only <@{{author}}> can use the buttons!",
	});
}

module.exports = new cmd(execute, {
	description: "Play a game of fast type! This will show you your WPM.",
	usage: "",
	dirname: __dirname,
	aliases: [],
	perms: [],
});
