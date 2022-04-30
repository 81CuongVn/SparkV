const Discord = require("discord.js");

module.exports = {
	once: false,
	async execute(bot, channel) {
		// If the application owner isn't ready yet, wait for it.
		if (!bot.application?.owner) await bot.application?.fetch().catch(() => {});

		// If the channel is a partial, wait for the channel to fetch.
		if (channel?.partial) await channel.fetch().catch(() => {});

		const data = await bot.database.getGuild(channel.guildId);

		if (!data?.logging?.enabled === "true") return;

		const logChannel = channel?.guild?.channels?.cache.get(data.logging?.channel);

		if (!logChannel) return;

		const embed = new Discord.MessageEmbed()
			.setDescription(`**Channel Deleted ${channel}**`)
			.setFooter({
				text: `Channel ID: ${channel.id}`,
				iconURL: bot.user.displayAvatarURL({ dynamic: true })
			})
			.setColor("RED")
			.setTimestamp();

		await logChannel.send({
			embeds: [embed]
		}).catch(() => {});
	}
};
