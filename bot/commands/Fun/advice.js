const Discord = require("discord.js");
const axios = require("axios");

const cmd = require("../../templates/command");

async function execute(bot, message) {
	axios.get("https://api.adviceslip.com/advice").then(async response => {
		const AdviceEmbed = new Discord.MessageEmbed()
			.setTitle("Here's an advice")
			.setDescription(response.data.slip.advice)
			.setFooter({
				text: `You got advice #${response.data.slip.id} • ${bot.config.embed.footer}`,
				iconURL: bot.user.displayAvatarURL({ dynamic: true })
			})
			.setColor(bot.config.embed.color)
			.setTimestamp();

		await message.replyT({
			embeds: [AdviceEmbed]
		});
	}).catch(err => bot.logger(err, "error"));
}

module.exports = new cmd(execute, {
	description: "You'll need it.",
	dirname: __dirname,
	aliases: ["helpful", "tip"],
	usage: "",
	slash: true
});
