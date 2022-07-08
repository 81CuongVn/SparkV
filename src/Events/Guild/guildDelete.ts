import Discord, { Colors } from "discord.js";

export default {
	once: false,
	async execute(bot: any, guild: any) {
		if (!guild.available) return;

		console.log(`SparkV has been removed from ${guild.name} (Id: ${guild.id}).`);

		bot.user.setPresence({
			status: "online",
			activities: [
				{
					name: `/help | ${bot.functions.formatNumber(await bot.functions.GetServerCount())} servers`,
					type: "PLAYING"
				}
			]
		});

		const Logger = bot.channels.cache.get("831314946624454656");
		const Owner = await guild?.fetchOwner().catch((): any => null) || null;

		if (Logger) {
			const ServerRemovedEmbed = new Discord.EmbedBuilder()
				.setTitle(`${bot.config.emojis.arrows.down}︱Guild Removed`)
				.setDescription(`SparkV left **${guild.name} (${guild.id})**.`)
				.addFields([
					{
						name: `${bot.config.emojis.player} **Members**`,
						value: `${bot.functions.formatNumber(guild.members.memberCount)}`,
						inline: true
					}, {
						name: "📅 **Created**",
						value: `<t:${~~(guild.createdAt / 1000)}:R>`,
						inline: true
					}
				])
				.setThumbnail(guild.iconURL())
				.setImage(guild.bannerURL())
				.setColor(Colors.Red);

			if (guild.vanityURLCode) {
				ServerRemovedEmbed
					.setURL(`https://discord.gg/${guild.vanityURLCode}`)
					.addFields([ { name: "🔗 **Vanity URL**", value: `https://discord.gg/${guild.vanityURLCode}`, inline: true } ]);
			}

			if (Owner) {
				ServerRemovedEmbed.setAuthor({
					name: Owner?.user?.username,
					iconURL: Owner?.user?.displayAvatarURL()
				});
			}

			Logger.send({
				embeds: [ServerRemovedEmbed]
			});
		}
	}
};
