const Discord = require("discord.js");

module.exports = {
	once: false,
	async execute(bot, guild, user) {
		const data = await bot.database.getGuild(guild.id);

		if (!data?.plugins?.logging?.enabled === "true") return;

		const channel = guild.channels.cache.find(c => c.id === data.plugins?.logging?.channel);

		if (!channel) return;

		const embed = new Discord.MessageEmbed()
			.setAuthor({
				name: user.tag,
				iconURL: user.displayAvatarURL({ dynamic: true })
			})
			.setDescription(`**User banned!**\n\n**User:** ${user}`)
			.setFooter({
				text: `User ID: ${user.id}`,
				iconURL: newM.author.displayAvatarURL({ dynamic: true })
			})
			.setColor("RED")
			.setTimestamp();

		await channel.send({
			embeds: [embed]
		}).catch(() => {});
	},
};
