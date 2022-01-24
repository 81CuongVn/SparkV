const Discord = require("discord.js");
const { NeverHaveIEver } = require("weky");

const cmd = require("../../templates/command");

async function execute(bot, message) {
	await NeverHaveIEver({
		message: message,
		embed: {
			title: "Never Have I Ever",
			color: "#5865F2",
			footer: bot.config.embed.footer,
			timestamp: true,
		},
		thinkMessage: "Loading",
		othersMessage: "Only <@{{author}}> can use the buttons!",
		buttons: {
			optionA: "Yes",
			optionB: "No",
		},
	});
}

module.exports = new cmd(execute, {
	description: "Asks you a question wether you have or have not done something.",
	usage: "",
	dirname: __dirname,
	aliases: ["nhie"],
	perms: ["EMBED_LINKS"],
});
