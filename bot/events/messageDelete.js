const Discord = require("discord.js");

module.exports = {
	once: false,
	async execute(bot, message) {
		if (message.author.bot) return;
		if (!message?.content) return;

		if (message?.content.length > 500) message.content = `${message?.content.slice(0, 96)}...`;
		if (message?.content.includes("@everyone") || message?.content.includes("@here")) message.content = message.cleanContent;

		const data = await bot.database.getGuild(message.guildId);

		if (!data?.plugins?.logging?.enabled === "true") return;

		const channel = message.guild.channels.cache.find(c => c.id === data.plugins?.logging?.channel);

		if (!channel) return;

		const embed = new Discord.MessageEmbed()
			.setAuthor({
				name: message.author.tag,
				iconURL: message.author.displayAvatarURL({ dynamic: true })
			})
			.setDescription(`**Message Deleted in ${message.channel}**`)
			.addField("Content", message.content, true)
			.setFooter({
				text: `User ID: ${message.author.id} | Message ID: ${message.id}`,
				iconURL: message.author.displayAvatarURL({ dynamic: true })
			})
			.setColor("RED")
			.setTimestamp();

		await channel.send({
			embeds: [embed]
		}).catch(() => {});
	},
};
