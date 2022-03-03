const Discord = require("discord.js");

module.exports = {
	once: false,
	async execute(bot, guild) {
		if (!guild.available) return;

		console.log(`SparkV has been added to ${guild.name} (Id: ${guild.id}).`);

		bot.user.setPresence({
			status: "online",
			activities: [{
				name: `${bot.config.prefix}Help | ${bot.functions.formatNumber(await bot.functions.GetServerCount())} servers`,
				type: "PLAYING"
			}],
		});

		const Logger = bot.channels.cache.get("831314946624454656");
		const Owner = await guild?.fetchOwner() || null;

		if (Logger) {
			const ServerAddedEmbed = new Discord.MessageEmbed()
				.setTitle("🔼︱Guild Added")
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
				embeds: [ServerAddedEmbed],
			});
		}

		if (guild.systemChannel) {
			const WelcomeEmbed = new Discord.MessageEmbed()
				.setTitle("Thanks for adding me!")
				.setDescription(`
					I'm a powerful multipurpose meme/chat bot with over **120+** commands to keep your server entertained and active, all while being free!\n
					Simply use the command \`/help\` to get a list of my commands.\n
					Want to enable a setting? You can either run \`/settings\`, or go to our dashboard by clicking the button \`Dashboard\` below.\n
					If you have any questions, feel free to join our server! https://discord.gg/PPtzT8Mu3h`)
				.setThumbnail(guild.iconURL())
				.setImage(guild.bannerURL())
				.setFooter({
					text: `SparkV • ${bot.config.embed.footer}`,
					iconURL: bot.user.displayAvatarURL()
				})
				.setColor(bot.config.embed.color);

			if (Owner) {
				WelcomeEmbed.setAuthor({
					name: Owner?.user?.tag,
					iconURL: Owner?.user?.displayAvatarURL({ dynamic: true })
				});
			}

			const InviteButton = new Discord.MessageButton()
				.setURL(bot.config.bot_invite)
				.setLabel("Bot Invite")
				.setStyle("LINK");

			const SupportButton = new Discord.MessageButton()
				.setURL(bot.config.support.invite)
				.setLabel("Support Invite")
				.setStyle("LINK");

			const Dashboard = new Discord.MessageButton()
				.setURL("https://www.sparkv.tk/dashboard")
				.setLabel("Dashboard")
				.setStyle("LINK");

			await guild.systemChannel.send({
				embeds: [WelcomeEmbed],
				components: [new Discord.MessageActionRow().addComponents(InviteButton, SupportButton, Dashboard)],
			}).catch(err => console.log(`Failed to send message to ${guild.name} (${guild.id})! ${err.message}`));
		}
	},
};
