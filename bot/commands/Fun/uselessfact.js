const Discord = require("discord.js");
const request = require("axios");

const cmd = require("../../templates/command");

async function execute(bot, message) {
	request.get("https://uselessfacts.jsph.pl/random.json?language=en").then(async response => {
		const FunFactEmbed = new Discord.MessageEmbed()
			.setTitle(`${bot.config.emojis.success} | Did you know?`)
			.setDescription(response.data.text)
			.setFooter({
				text: `Fun facts powered by https://uselessfacts.jsph.pl! • ${bot.config.embed.footer}`,
				iconURL: bot.user.displayAvatarURL({ dynamic: true })
			})
			.setColor(bot.config.embed.color)
			.setTimestamp();

		await message.replyT({
			embeds: [FunFactEmbed],
		});
	});
}

module.exports = new cmd(execute, {
	description: "I will get a useless fact! You're better off with the advice command...",
	aliases: ["uf"],
	dirname: __dirname,
	usage: "",
	slash: true
});
