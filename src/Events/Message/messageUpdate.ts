import Discord from "discord.js";

export default {
	once: false,
	async execute(bot: any, oldM: any, newM: any) {
		await bot.emit("messageCreate", newM);

		if (!newM.editedAt) return;
		if (newM.author.bot) return;
		if (!oldM.content || !newM.content) return;
		if (newM.content.length > 1024) return;
		if (newM.content === oldM.content) return;
		if (newM.content.includes("@everyone") || newM.content.includes("@here")) newM.content = newM.cleanContent;

		const data = await bot.database.getGuild(newM.guildId);

		if (data?.logging?.enabled === "true") {
			const channel = newM.channel?.guild?.channels?.cache.get(data.logging?.channel);
			if (!channel) return;

			const embed = new Discord.MessageEmbed()
				.setAuthor({
					name: newM.author.tag,
					iconURL: newM.author.displayAvatarURL({ dynamic: true })
				})
				.setDescription(`**Message Edited in ${newM.channel}**`)
				.addField("Before", oldM.content, true)
				.addField("After", newM.content, true)
				.setFooter({
					text: `User ID: ${newM.author.id} | Message ID: ${newM.id}`,
					iconURL: newM.author.displayAvatarURL({ dynamic: true })
				})
				.setColor("YELLOW")
				.setTimestamp();

			await channel.send({
				embeds: [embed]
			}).catch((): any => { });
		}
	},
};
