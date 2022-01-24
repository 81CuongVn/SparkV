const Discord = require("discord.js");
const { WouldYouRather } = require("weky");

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	await WouldYouRather({
		message: message,
		embed: {
			title: "Would you rather...",
			color: "#7289da",
			footer: bot.config.embed.footer,
			timestamp: true,
		},
		thinkMessage: "Loading",
		othersMessage: "Only <@{{author}}> can use the buttons!",
		buttons: { optionA: "Option A", optionB: "Option B" },
	});
}

module.exports = new cmd(execute, {
	description: "Would you rather.",
	dirname: __dirname,
	usage: "",
	aliases: ["wyr"],
	perms: ["EMBED_LINKS"],
});
