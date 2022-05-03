const Discord = require("discord.js");

module.exports = {
	once: false,
	async execute(bot, guild) {
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
		const Owner = await guild?.fetchOwner() || null;

		if (Logger) {
			const ServerAddedEmbed = new Discord.MessageEmbed()
				.setTitle(`${bot.config.emojis.arrows.up}︱Guild Added`)
				.setDescription(`SparkV has joined **${guild.name} (${guild.id})**!`)
				.addField(`${bot.config.emojis.player} **Members**`, `${bot.functions.formatNumber(guild.memberCount)}`, true)
				.addField("📅 **Created**", `<t:${~~(guild.createdAt / 1000)}:R>`, true)
				.setThumbnail(guild.iconURL())
				.setImage(guild.bannerURL())
				.setColor("GREEN");

			if (guild.vanityURLCode) {
				ServerAddedEmbed
					.setURL(`https://discord.gg/${guild.vanityURLCode}`)
					.addField("🔗 **Vanity URL**", `https://discord.gg/${guild.vanityURLCode}`, true);
			}

			if (Owner) {
				ServerAddedEmbed.setAuthor({
					name: Owner?.user?.username,
					iconURL: Owner?.user?.displayAvatarURL({ dynamic: true })
				});
			}

			Logger.send({
				embeds: [ServerAddedEmbed]
			});
		}

		if (guild.systemChannel) {
			const WelcomeEmbed = new Discord.MessageEmbed()
				.setDescription(`I'm a powerful Discord bot with the purpose to make your server better and more unique, without making things complicated. I have many features which have been proven to boost your server's activity. If you want to setup/configure SparkV, you can type \`/settings\`.\n\nSimply type the command \`/help\` to get a list of my commands.\nIf you have any questions, feel free to join our [Discord server](https://discord.gg/PPtzT8Mu3h).`)
				.setThumbnail(bot.user.displayAvatarURL())
				.setImage("https://www.sparkv.tk/assets/images/banner.gif")
				.setColor(bot.config.embed.color)
				.setTimestamp();

			if (Owner) {
				WelcomeEmbed.setAuthor({
					name: Owner?.user?.tag,
					iconURL: Owner?.user?.displayAvatarURL({ dynamic: true })
				});
			}

			const InviteButton = new Discord.MessageButton()
				.setURL(bot.config.bot_invite)
				.setEmoji(bot.config.emojis.plus)
				.setLabel("Invite")
				.setStyle("LINK");

			const SupportButton = new Discord.MessageButton()
				.setURL(bot.config.support.invite)
				.setEmoji(bot.config.emojis.question)
				.setLabel("Support")
				.setStyle("LINK");

			const WebsiteButton = new Discord.MessageButton()
				.setURL("https://www.sparkv.tk/")
				.setEmoji(bot.config.emojis.globe)
				.setLabel("Website")
				.setStyle("LINK");

			await guild.systemChannel.send({
				embeds: [WelcomeEmbed],
				components: [new Discord.MessageActionRow().addComponents(InviteButton, SupportButton, WebsiteButton)]
			}).catch(err => console.log(`Failed to send message to ${guild.name} (${guild.id})! ${err.message}`));
		}
	}
};
