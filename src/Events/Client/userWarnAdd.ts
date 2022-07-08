import Discord, { Colors } from "discord.js";

export default {
	once: false,
	async execute(bot: any, guild: any, user: any, reason: any) {
		const data = await bot.database.getGuild(guild.id);
		if (data?.logging?.enabled === "true") {
			const channel = guild?.channels?.cache.get(data.logging?.channel);
			if (!channel) return;

			const embed = new Discord.EmbedBuilder()
				.setAuthor({
					name: user.user.tag,
					iconURL: user.user.displayAvatarURL()
				})
				.setDescription(`**${user} has been warned!**`)
				.addFields([ { name: "Reason", value: reason, inline: true } ])
				.setFooter({
					text: `User ID: ${user.user.id}`,
					iconURL: user.user.displayAvatarURL()
				})
				.setColor(Colors.Yellow)
				.setTimestamp();

			await channel.send({
				embeds: [embed]
			}).catch((): any => { });
		}
	}
};
