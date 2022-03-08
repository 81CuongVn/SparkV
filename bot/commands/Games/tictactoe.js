const TicTacToe = require("discord-tictactoe");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

const cmd = require("../../templates/command");

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

	// Let turn = "USER";
	// let buttons = [];
	// const board = [
	// 	null, null, null,
	// 	null, null, null,
	// 	null, null, null,
	// ];

	// async function GenerateMove() {
	// 	// In the future, this will be much smarter. For now, it will return a random number between 1 and 9 to place on the board.
	// 	const move = Math.floor(Math.random() * 9);

	// 	return move;
	// }

	// async function setupBoard() {
	// 	buttons = [];

	// 	const row1 = new MessageActionRow();
	// 	const row2 = new MessageActionRow();
	// 	const row3 = new MessageActionRow();

	// 	for (let i = 0; i < 9; i++) {
	// 		function createB(row) {
	// 			if (board[i] === null) {
	// 				row.components.push(new MessageButton()
	// 					.setLabel(" ")
	// 					.setCustomId(`select_${i}`)
	// 					.setStyle("SECONDARY"));
	// 			} else if (board[i] === "X") {
	// 				row.components.push(new MessageButton()
	// 					.setLabel("X")
	// 					.setCustomId(`select_${i}`)
	// 					.setStyle("SUCCESS"));
	// 			} else if (board[i] === "O") {
	// 				row.components.push(new MessageButton()
	// 					.setLabel("O")
	// 					.setCustomId(`select_${i}`)
	// 					.setStyle("DANGER"));
	// 			}
	// 		}

	// 		if (i === 0 || i === 1 || i === 2) {
	// 			createB(row1);
	// 		} else if (i === 3 || i === 4 || i === 5) {
	// 			createB(row2);
	// 		} else if (i === 6 || i === 7 || i === 8) {
	// 			createB(row3);
	// 		}
	// 	}

	// 	buttons = [
	// 		row1,
	// 		row2,
	// 		row3,
	// 	];
	// }

	// setupBoard();

	// const BoardEmbed = new MessageEmbed()
	// 	.setAuthor({
	// 		name: (message.user ? message.user : message.author).tag,
	// 		iconURL: (message.user ? message.user : message.author).displayAvatarURL({ dynamic: true })
	// 	})
	// 	.setTitle(`${(message.user ? message.user : message.author).tag} VS AI`)
	// 	.setDescription(`${message.user ? message.user : message.author}'s turn.`)
	// 	.setColor("GREEN");

	// const botMessage = await message.replyT({
	// 	embeds: [BoardEmbed],
	// 	components: buttons,
	// 	ephemeral: true,
	// });

	// const collector = botMessage.createMessageComponentCollector({
	// 	time: 1500 * 1000
	// });

	// collector.on("collect", async interaction => {
	// 	const boardNumber = parseInt(interaction.customId.split("_")[1]);

	// 	console.log("clicked: ", interaction.customId);
	// 	console.log("board: ", boardNumber);

	// 	if (turn === "API") {
	// 		console.log("API's turn!");
	// 		return interaction.replyT({
	// 			content: "It's my turn! Please wait for me to pick a move...",
	// 			ephemeral: true,
	// 		});
	// 	}

	// 	if (board[boardNumber] === null) {
	// 		if (turn === "API") {
	// 			// AI's turn. Don't let the user click on the board.
	// 		} else {
	// 			board[boardNumber] = "X";
	// 			BoardEmbed
	// 				.setDescription(`API's turn.`)
	// 				.setColor("RED");

	// 			turn = "API";

	// 			const move = await GenerateMove();
	// 			board[move] = "O";

	// 			await bot.wait(2000);

	// 			interaction.deferUpdate();

	// 			BoardEmbed
	// 				.setDescription(`${message.user ? message.user : message.author}'s turn.`)
	// 				.setColor("GREEN");

	// 			turn = "USER";
	// 		}
	// 	} else {
	// 		return interaction.channel.send({
	// 			content: `${message.user ? message.user : message.author}, That space is already taken!`,
	// 			ephemeral: true
	// 		});
	// 	}

	// 	if (!board.includes(null)) return await message.replyT(`Game over! There are no spots left on the board, so it's a tie.`);

	// 	setupBoard();

	// 	await botMessage?.edit({
	// 		embeds: [BoardEmbed],
	// 		components: buttons,
	// 		ephemeral: true,
	// 	});
	// });

	// collector.on("end", async () => {
	// 	try {
	// 		await botMessage?.edit({
	// 			embeds: [
	// 				Menu
	// 					.setTitle(await message.translate("Tic Tac Toe - Timed Out!"), bot.user.displayAvatarURL({ dynamic: true }))
	// 					.setDescription(await message.translate("You have gone inactive, so the game expired!"))
	// 			],
	// 			components: []
	// 		});
	// 	} catch (err) {
	// 		// Do nothing. This is just to stop errors from going into the console. It's mostly for the case where the message is deleted.
	// 	}
	// });
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
