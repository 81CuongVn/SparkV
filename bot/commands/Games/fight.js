const Discord = require("discord.js");
const { Fight } = require("weky");

const cmd = require("../../templates/command");

async function execute(bot, message) {
	if (!message.mentions.users.first()) {
		return await message.replyT("Next time, mention someone to fight.");
	}

	await Fight({
		message: message,
		opponent: message.mentions.users.first(),
		embed: {
			title: "Fight",
			color: "#5865F2",
			footer: bot.config.embed.footer,
			timestamp: true,
		},
		buttons: {
			hit: "Hit",
			heal: "Heal",
			cancel: "Stop",
			accept: "Accept",
			deny: "Deny",
		},
		acceptMessage: "<@{{challenger}}> has challenged <@{{opponent}}> for a fight!",
		winMessage: "<@{{winner}}> has won the fight!",
		endMessage: "<@{{opponent}}> didn't answer in time.",
		cancelMessage: "<@{{opponent}}> refused to fight you. What a chicken!",
		fightMessage: "{{player}}, you're up first!",
		opponentsTurnMessage: "Please wait for your opponents move.",
		highHealthMessage: "You cannot heal if your HP is above 80.",
		lowHealthMessage: "You cannot run from the fight if your HP is below 50. That's not fair!",
		returnWinner: false,
		othersMessage: "Only {{author}} can use the buttons!",
	});
}

module.exports = new cmd(execute, {
	description: "Fight another player!",
	usage: "(user)",
	dirname: __dirname,
	aliases: [],
	perms: ["EMBED_LINKS"],
});
