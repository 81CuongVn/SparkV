const TicTacToe = require("discord-tictactoe");
const Discord = require("discord.js");

const cmd = require("../../templates/command");

const Game = new TicTacToe({ language: "en" }, global.bot);

async function execute(bot, message, args, command, data) {
	if (message.inGuild()) {
		Game.handleInteraction(message, bot);
	} else {
		Game.handleMessage(message);
	}
}

module.exports = new cmd(execute, {
	description: "Play a game of Tic Tac Toe with me or mention someone to play with!",
	dirname: __dirname,
	usage: "",
	aliases: ["ttt"],
	perms: ["ADD_REACTIONS", "MANAGE_MESSAGES", "READ_MESSAGE_HISTORY", "VIEW_CHANNEL", "SEND_MESSAGES"],
	slash: true
});
