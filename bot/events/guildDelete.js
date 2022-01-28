const Discord = require("discord.js");

module.exports = {
	once: false,
	async execute(bot, guild) {
		if (!guild.available) return;

		console.log(`SparkV has been removed from ${guild.name} (Id: ${guild.id}).`);

		bot.user.setPresence({
			status: "online",
			activities: [
				{
					name: `${bot.config.prefix}Help | ${bot.functions.formatNumber(
						await bot.functions.GetServerCount(),
					)} servers`,
					type: "PLAYING",
				},
			],
		});

		const Logger = bot.channels.cache.get("831314946624454656");

		if (Logger) {
			const ServerRemovedEmbed = new Discord.MessageEmbed()
				.setTitle("🔽︱Guild Removed")
				.setDescription(`SparkV left **${guild.name} (${guild.id})**.`)
				.setThumbnail(guild.iconURL())
				.setImage(guild.bannerURL())
				.setColor("RED");

			Logger.send({
				embeds: [ServerRemovedEmbed],
			});
		}
	},
};
