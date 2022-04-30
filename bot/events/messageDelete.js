const Discord = require("discord.js");

module.exports = {
	once: false,
	async execute(bot, message) {
		// If the application owner isn't ready yet, wait for it.
		if (!bot.application?.owner) await bot.application?.fetch().catch(() => {});

		// If the message is a partial, wait for the message to fetch.
		if (message?.partial) await message.fetch().catch(() => {});

		// If the channel is a partial, wait for the channel to fetch.
		if (message.channel?.partial) await message.channel.fetch().catch(() => {});

		if (!message?.content) return;
		if (message?.author?.bot) return;

		if (message?.content.length < 2) return;
		if (message?.content.length > 500) message.content = `${message?.content.slice(0, 96)}...`;
		if (message?.content.includes("@everyone") || message?.content.includes("@here")) message.content = message.cleanContent;

		const data = await bot.database.getGuild(message.guildId);

		if (!data?.logging?.enabled === "true") return;

		const channel = message.channel?.guild?.channels?.cache.get(data.logging?.channel);

		if (!channel) return;

		const embed = new Discord.EmbedBuilder()
			.setAuthor({
				name: message.author.tag,
				iconURL: message.author.displayAvatarURL({ dynamic: true })
			})
			.setDescription(`**Message Deleted in ${message.channel}**`)
			.addField("Content", message.content, true)
			.setFooter({
				text: `User ID: ${message.author.id} | Message ID: ${message.id}`,
				iconURL: message.author.displayAvatarURL({ dynamic: true })
			})
			.setColor("#ED4245")
			.setTimestamp();

		await channel.send({
			embeds: [embed]
		}).catch(() => {});
	}
};
