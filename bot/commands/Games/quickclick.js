const Discord = require("discord.js");
const { QuickClick } = require("weky");

const scramble = [
	"sparkv",
	"is",
	"the",
	"best",
	"bot",
	"EVER"
];

const cmd = require("../../templates/command");

async function execute(bot, message) {
	await QuickClick({
		message: message,
		embed: {
			title: "Quick Click",
			color: "#5865F2",
			footer: bot.config.embed.footer,
			timestamp: true
		},
		time: 60000,
		waitMessage: "The buttons may appear anytime now!",
		startMessage:
            "First person to press the correct button will win. You have **{{time}}**!",
		winMessage: "GG, <@{{winner}}> pressed the button in **{{time}} seconds**.",
		loseMessage: "No one pressed the button in time. So, I dropped the game!",
		emoji: "👆",
		ongoingMessage:
            "A game is already runnning in <#{{channel}}>. You can't start a new one!"
	});
}

module.exports = new cmd(execute, {
	description: "First person to click the button wins!",
	usage: "",
	dirname: __dirname,
	aliases: [],
	perms: [],
});
