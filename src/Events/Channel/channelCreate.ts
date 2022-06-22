import Discord from "discord.js";

export default {
	once: false,
	async execute(bot: any, channel: any) {
		if (!bot.application?.owner) await bot.application?.fetch().catch((): any => { });
		if (channel?.partial) await channel.fetch().catch((): any => { });

		const data: any = await bot.database.getGuild(channel.guildId);
		if (data?.logging?.enabled === "true") {
			const logChannel = channel?.guild?.channels?.cache?.get(data.logging?.channel);
			if (!logChannel) return;

			const embed = new Discord.MessageEmbed()
				.setDescription(`**Channel Created ${channel}**`)
				.setFooter({
					text: `Channel ID: ${channel.id}`,
					iconURL: bot.user.displayAvatarURL({ dynamic: true })
				})
				.setColor("GREEN")
				.setTimestamp();

			await logChannel.send({
				embeds: [embed]
			}).catch((): any => { });
		}
	},
};
