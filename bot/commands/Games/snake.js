const Discord = require(`discord.js`);
const { Snake } = require("weky");

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	await Snake({
		message: message,
		embed: {
			title: "Snake",
			description: "Game over. You scored **{{score}}** points!",
			footer: bot.config.embed.footer,
			color: "#7289da",
			timestamp: true,
		},
		emojis: {
			empty: "⬛",
			snakeBody: "🟩",
			food: "🍎",
			up: "⬆️",
			right: "⬅️",
			down: "⬇️",
			left: "➡️",
		},
		othersMessage: "Only <@{{author}}> can use the buttons!",
		buttonText: "End",
	});
}

module.exports = new cmd(execute, {
	description: `Get those apples and grow, grow, grow to get the best score.`,
	dirname: __dirname,
	usage: "",
	aliases: [],
	perms: [],
});
