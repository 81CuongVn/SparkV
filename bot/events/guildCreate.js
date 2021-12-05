const Discord = require("discord.js");

module.exports = {
	once: false,
	async execute(bot, guild) {
		if (!guild.available) return;

		await bot.LoadSlashCommands();

		console.log(`SparkV has been added to ${guild.name} (Id: ${guild.id}).`);

		bot.user.setPresence({
			status: "online",
			activities: [{
				name: `${bot.config.prefix}Help | ${bot.functions.formatNumber(await bot.functions.GetServerCount())} servers`,
				type: "PLAYING"
			}],
		});

		const Logger = bot.channels.cache.get("831314946624454656");

		if (Logger) {
			const ServerAddedEmbed = new Discord.MessageEmbed()
				.setTitle("🔼︱Guild Added")
				.setDescription(`SparkV has joined **${guild.name} (${guild.id})**!`)
				.setColor("GREEN");

			Logger.send({
				embeds: [ServerAddedEmbed],
			});
		}

		if (guild.systemChannel) {
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
				content:
					"Hi! My name's SparkV. I'm a powerful multipurpose meme/chat bot with over 100+ commands to keep your server entertained and active! All, without spending a dime. Simply use the command ^Help to get a list of my commands. Want to enable a setting? Go to my dashboard! Use the command ^Dashboard and click on the link I send you. Thanks for inviting me!\n\nPsst... don't froget to review me on top.gg! Oh, and also mention me (if chatbot is enable) to talk to me!",
				components: [new Discord.MessageActionRow().addComponents(InviteButton, SupportButton, VoteButton)],
			}).catch(err => console.log(`Failed to send message to ${guild.name} (${guild.id})! ${err.message}`));
		}
	},
};
