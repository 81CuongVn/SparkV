const Discord = require("discord.js");

module.exports = {
	once: false,
	async execute(bot, guild, user, reason) {
		const data = await bot.database.getGuild(guild.id);

		if (!data?.plugins?.logging?.enabled === "true") return;

		const channel = guild.channels.cache.find(c => c.id === data.plugins?.logging?.channel);

		if (!channel) return;

		const embed = new Discord.MessageEmbed()
			.setAuthor({
				name: user.user.tag,
				iconURL: user.user.displayAvatarURL({ dynamic: true })
			})
			.setDescription(`**${user} has been warned!**`)
			.addField("Reason", reason, true)
			.setFooter({
				text: `User ID: ${user.user.id}`,
				iconURL: user.user.displayAvatarURL({ dynamic: true })
			})
			.setColor("YELLOW")
			.setTimestamp();

		await channel.send({
			embeds: [embed]
		}).catch(() => {});
	},
};
