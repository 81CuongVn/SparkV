const Discord = require("discord.js");

module.exports = {
	once: false,
	async execute(bot, oldM, newM) {
		if (!newM.editedAt) return;

		const data = await bot.database.getGuild(newM.guildId);

		if (!data?.plugins?.logging?.enabled === "true") return;

		const channel = newM.guild.channels.cache.find(c => c.id === data.plugins?.logging?.channel);

		if (!channel) return;

		const embed = new Discord.MessageEmbed()
			.setAuthor({
				name: newM.author.tag,
				iconURL: newM.author.displayAvatarURL({ dynamic: true })
			})
			.setDescription(`**Message Edited in ${newM.channel}**`)
			.addField("Old Message", oldM.content, true)
			.addField("New Message", newM.content, true)
			.setColor("YELLOW")
			.setTimestamp();

		await channel.send({
			embeds: [embed]
		}).catch(() => {});
	},
};
