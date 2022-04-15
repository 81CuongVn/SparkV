const TicTacToe = require("discord-tictactoe");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

const cmd = require("@templates/command");

const game = new TicTacToe({
	language: "en",
	commandOptionName: "user"
});

async function execute(bot, message, args, command, data) {
	if (message?.applicationId) {
		game.handleInteraction(message, bot);
	} else {
		game.handleMessage(message);
	}
}

module.exports = new cmd(execute, {
	description: "Play a game of Tic Tac Toe with me or mention someone to play with!",
	dirname: __dirname,
	usage: "",
	aliases: ["ttt"],
	perms: ["VIEW_CHANNEL", "SEND_MESSAGES"],
	slash: true,
	options: [
		{
			type: 6,
			name: "user",
			description: "The user you want to play against. Leave empty to play against the bot.",
			required: false
		}
	]
});
