const Discord = require("discord.js");
const { RockPaperScissors } = require("weky");

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	if (!message.mentions.users.first()) {
		return await message.replyT("lol you need to mention someone to play against.");
	}

	await RockPaperScissors({
		message: message,
		opponent: message.mentions.users.first(),
		embed: {
			title: "Rock Paper Scissors",
			description: "Press the button below to choose your element.",
			footer: bot.config.embed.footer,
			color: "#7289da",
			timestamp: true,
		},
		buttons: {
			rock: "Rock",
			paper: "Paper",
			scissors: "Scissors",
			accept: "Accept",
			deny: "Deny",
		},
		time: 60 * 1000,
		acceptMessage: "<@{{challenger}}> has challenged <@{{opponent}}> for a game of Rock Paper and Scissors!",
		winMessage: "<@{{winner}}> has won the game!",
		drawMessage: "Draw!",
		endMessage: "<@{{opponent}}> didn't answer in time.",
		timeEndMessage: "Both of you didn't pick something in time.",
		cancelMessage: "<@{{opponent}}> refused to have a game of Rock Paper and Scissors with you. What a noob.",
		choseMessage: "You picked {{emoji}}.",
		noChangeMessage: "You cannot change your selection.",
		othersMessage: "Only {{author}} can use the buttons.",
		returnWinner: false,
	});
}

module.exports = new cmd(execute, {
	description: "Play a game of Rock Paper Scissors with me!",
	dirname: __dirname,
	usage: "",
	aliases: ["rps"],
	perms: [],
});
