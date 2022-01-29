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
				.addField("<:player:933552618272350249> **Members**", `${bot.functions.formatNumber(guild.memberCount)}`, true)
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
					Simply use the command /help or ^help to get a list of my commands. Want to enable a setting? Go to my dashboard! Use the command ^Dashboard and click on the link I send you.\n
					If you have any questions, feel free to join our server! https://discord.gg/PPtzT8Mu3h`)
				.addField("Want to Enable A Setting?", `
					Use the command ^Dashboard or /Dashboard and click on the link I send you.\n
					Select a server, and personilize the heck out of me! I can even talk to you if you set Chat Bot to enabled.`)
				.addField("SparkV's Plan", `
					SparkV's plan is to defeat the money-hungry Discord bot Mee6 in server count and to be the best free Discord bot out there.\n
					I'm currently in **${bot.functions.formatNumber(bot.guilds.cache.size)}** guilds, and I'm growing fast!
					I need your help to defeat the money-hungry Mee6. Please tell your friends about me. I need **${16000000 - bot.guilds.cache.size}** more guilds until we pass Mee6!`)
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

			const VoteButton = new Discord.MessageButton()
				.setURL("https://top.gg/bot/884525761694933073")
				.setLabel("Review/Vote for me!")
				.setStyle("LINK");

			await guild.systemChannel.send({
				embeds: [WelcomeEmbed],
				components: [new Discord.MessageActionRow().addComponents(InviteButton, SupportButton, VoteButton)],
			}).catch(err => console.log(`Failed to send message to ${guild.name} (${guild.id})! ${err.message}`));
		}
	},
};
