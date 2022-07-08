import Discord, { ButtonStyle, Colors } from "discord.js";

export default {
	once: false,
	async execute(bot: any, guild: any) {
		if (!guild.available) return;

		console.log(`SparkV has been added to ${guild.name} (Id: ${guild.id}).`);

		bot.user.setPresence({
			status: "online",
			activities: [{
				name: `/help | ${bot.functions.formatNumber(await bot.functions.GetServerCount())} servers`,
				type: "PLAYING"
			}]
		});

		const Logger = bot.channels.cache.get("831314946624454656");
		const Owner = await guild?.fetchOwner().catch((): any => null) || null;

		if (Logger) {
			const ServerAddedEmbed = new Discord.EmbedBuilder()
				.setTitle(`${bot.config.emojis.arrows.up}︱Guild Added`)
				.setDescription(`SparkV has joined **${guild.name} (${guild.id})**!`)
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
				.setColor(Colors.Green);

			if (guild.vanityURLCode) {
				ServerAddedEmbed
					.setURL(`https://discord.gg/${guild.vanityURLCode}`)
					.addFields([ { name: "🔗 **Vanity URL**", value: `https://discord.gg/${guild.vanityURLCode}`, inline: true } ]);
			}

			if (Owner) {
				ServerAddedEmbed.setAuthor({
					name: Owner?.user?.username,
					iconURL: Owner?.user?.displayAvatarURL()
				});
			}

			Logger.send({ embeds: [ServerAddedEmbed] });
		}

		if (guild.systemChannel) {
			const WelcomeEmbed = new Discord.EmbedBuilder()
				.setDescription(`I'm a powerful Discord bot with the purpose to make your server better and more unique, without making things complicated. I have many features which have been proven to boost your server's activity. If you want to setup/configure SparkV, you can type \`/settings\`.\n\nSimply type the command \`/help\` to get a list of my commands.\nIf you have any questions, feel free to join our [Discord server](https://discord.gg/PPtzT8Mu3h).`)
				.setThumbnail(bot.user.displayAvatarURL())
				.setImage("https://www.sparkv.tk/images/banner.gif")
				.setColor(Colors.Blue)
				.setTimestamp();

			if (Owner) {
				WelcomeEmbed.setAuthor({
					name: Owner?.user?.tag,
					iconURL: Owner?.user?.displayAvatarURL()
				});
			}

			const InviteButton = new Discord.ButtonBuilder()
				.setURL(bot.config.bot_invite)
				.setEmoji(bot.config.emojis.plus)
				.setLabel("Invite")
				.setStyle(ButtonStyle.Link);

			const SupportButton = new Discord.ButtonBuilder()
				.setURL(bot.config.support)
				.setEmoji(bot.config.emojis.question)
				.setLabel("Support")
				.setStyle(ButtonStyle.Link);

			const WebsiteButton = new Discord.ButtonBuilder()
				.setURL("https://www.sparkv.tk/")
				.setEmoji(bot.config.emojis.globe)
				.setLabel("Website")
				.setStyle(ButtonStyle.Link);

			await guild.systemChannel.send({
				embeds: [WelcomeEmbed],
				components: [{ type: 1, components: [InviteButton, SupportButton, WebsiteButton] }]
			}).catch((err: any) => console.log(`Failed to send message to ${guild.name} (${guild.id})! ${err.message}`));
		}
	}
};
