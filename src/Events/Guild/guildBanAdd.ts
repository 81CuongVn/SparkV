import Discord from 'discord.js';

export default {
	once: false,
	async execute(bot: any, guild: any, user: any) {
		const data = await bot.database.getGuild(guild.id);
		if (data?.logging?.enabled === 'true') {
			const channel = guild?.channels?.cache.get(data.logging?.channel);
			if (!channel) return;

			const embed = new Discord.MessageEmbed()
				.setAuthor({
					name: user.tag,
					iconURL: user.displayAvatarURL({ dynamic: true }),
				})
				.setDescription(`**User banned!**\n\n**User:** ${user}`)
				.setFooter({
					text: `User ID: ${user.id}`,
					iconURL: user.displayAvatarURL({ dynamic: true }),
				})
				.setColor('RED')
				.setTimestamp();

			await channel
				.send({
					embeds: [embed],
				})
				.catch((): any => { });
		}
	},
};
