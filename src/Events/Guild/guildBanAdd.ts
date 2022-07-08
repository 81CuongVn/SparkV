import Discord, { Colors } from 'discord.js';

export default {
	once: false,
	async execute(bot: any, guild: any, user: any) {
		const data = await bot.database.getGuild(guild.id);
		if (data?.logging?.enabled === 'true') {
			const channel = guild?.channels?.cache.get(data.logging?.channel);
			if (!channel) return;

			const embed = new Discord.EmbedBuilder()
				.setAuthor({
					name: user.tag,
					iconURL: user.displayAvatarURL(),
				})
				.setDescription(`**User banned!**\n\n**User:** ${user}`)
				.setFooter({
					text: `User ID: ${user.id}`,
					iconURL: user.displayAvatarURL(),
				})
				.setColor(Colors.Red)
				.setTimestamp();

			await channel
				.send({
					embeds: [embed],
				})
				.catch((): any => { });
		}
	},
};
