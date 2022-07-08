import Discord, { Colors } from "discord.js";

export default {
	once: false,
	async execute(bot: any, message: any) {
		// If the application owner isn't ready yet, wait for it.
		if (!bot.application?.owner) await bot.application?.fetch().catch((): any => { });

		// If the message is a partial, wait for the message to fetch.
		if (message?.partial) await message.fetch().catch((): any => { });

		// If the channel is a partial, wait for the channel to fetch.
		if (message.channel?.partial) await message.channel.fetch().catch((): any => { });

		if (!message?.content) return;
		if (message?.author?.bot) return;

		if (message?.content.length < 2) return;
		if (message?.content.length > 500) message.content = `${message?.content.slice(0, 96)}...`;
		if (message?.content.includes("@everyone") || message?.content.includes("@here")) message.content = message.cleanContent;

		const data = await bot.database.getGuild(message.guildId);
		if (data?.logging?.enabled === "true") {
			const channel = message.channel?.guild?.channels?.cache.get(data.logging?.channel);
			if (!channel) return;

			const embed = new Discord.EmbedBuilder()
				.setAuthor({
					name: message.author.tag,
					iconURL: message.author.displayAvatarURL()
				})
				.setDescription(`**Message Deleted in ${message.channel}**`)
				.addFields([ { name: "Content", value: message.content, inline: true } ])
				.setFooter({
					text: `User ID: ${message.author.id} | Message ID: ${message.id}`,
					iconURL: message.author.displayAvatarURL()
				})
				.setColor(Colors.Red)
				.setTimestamp();

			await channel.send({
				embeds: [embed]
			}).catch((): any => { });
		}
	}
};
