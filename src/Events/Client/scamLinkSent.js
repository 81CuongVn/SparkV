import Discord from "discord.js";

export default {
	once: false,
	async execute(bot, message, data) {
		if (!data?.logging?.enabled === "true") return;

		const channel = message.channel?.guild?.channels?.cache.get(data.logging?.channel);

		if (!channel) return;

		const embed = new Discord.MessageEmbed()
			.setAuthor({
				name: message.author.tag,
				iconURL: message.author.displayAvatarURL({ dynamic: true })
			})
			.setDescription(`${bot.config.emojis.alert} | **${message.author} sent a scam link!**\n\n${bot.config.emojis.id} | **ID:** ${message.author.id}`)
			.setColor("RED")
			.setTimestamp();

		await channel.send({
			embeds: [embed]
		}).catch(() => {});
	}
};
