const Discord = require("discord.js");
const request = require("axios");

const cmd = require("../../templates/command");

async function execute(bot, message) {
	request.get("https://api.adviceslip.com/advice")
		.then(async response => {
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
		}).catch(err => console.error(err));
}

module.exports = new cmd(execute, {
	description: "You'll need it.",
	dirname: __dirname,
	aliases: ["helpfult", "htip"],
	usage: ``,
});
