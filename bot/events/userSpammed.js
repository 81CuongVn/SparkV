const Discord = require("discord.js");

module.exports = {
	once: false,
	async execute(bot, message, data) {
		if (!data?.logging?.enabled === "true") return;

		const channel = channel?.guild?.channels?.cache.get(data.logging?.channel);

		if (!channel) return;

		const embed = new Discord.EmbedBuilder()
			.setAuthor({
				name: message.author.tag,
				iconURL: message.author.displayAvatarURL({ dynamic: true })
			})
			.setDescription(`${bot.config.emojis.alert} | **${message.author} has Spammed!**\n\n${bot.config.emojis.id} | **ID:** ${message.author.id}`)
			.setColor("#ED4245")
			.setTimestamp();

		await channel.send({
			embeds: [embed]
		}).catch(() => {});
	}
};
