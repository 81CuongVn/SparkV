const Discord = require("discord.js");
const os = require("os");

const cmd = require("@templates/command");

module.exports = new cmd(
	async (bot, message) => {
		const loadingEmbed = new Discord.MessageEmbed()
			.setAuthor({
				name: message.user.tag,
				iconURL: message.user.displayAvatarURL({ dynamic: true })
			})
			.setTitle(await message.translate(`${bot.config.emojis.config} | Loading stats...`))
			.setDescription(await message.translate(`Please wait while I load my statistics...`))
			.setFooter({
				text: bot.config.embed.footer,
				icon_url: bot.user.displayAvatarURL({ dynamic: true })
			})
			.setColor(bot.config.embed.color)
			.setTimestamp();

		const BotMessage = await message.replyT({
			embeds: [loadingEmbed],
			fetchReply: true
		});

		// RamData = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}/${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)

		const StatsEmbed = new Discord.MessageEmbed()
			.setAuthor({
				name: (message.user ? message.user : message.author).tag,
				iconURL: (message.user ? message.user : message.author).displayAvatarURL({ dynamic: true })
			})
			.addField(`**${await message.translate("Server")}**`, `${bot.config.emojis.rocket} ${await message.translate("CPU")}: **${(process.cpuUsage().system / 1000 / 1000 / 10).toFixed(2)}%**\n${bot.config.emojis.clock} Uptime: **${bot.functions.MSToTime(bot.uptime, "short")}**`, true)
			.addField(`**${await message.translate("Bot Statistics")}**`, `${bot.config.emojis.globe} ${await message.translate("Servers")}: **${bot.functions.formatNumber(await bot.functions.GetServerCount())}**\n${bot.config.emojis.player} Users: **${bot.functions.formatNumber(await bot.functions.GetUserCount())}**`, true)
			.setImage("https://dblstatistics.com/bot/884525761694933073/widget/servers?width=1500&height=700&titleFontSize=20&labelFontSize=40&fillColor=0a1227?&lineColor=4752cc&backgroundColor=00000000")
			.setFooter({
				text: `A special thanks to waya.one for the above statistics.`,
				iconURL: bot.user.displayAvatarURL({ dynamic: true })
			})
			.setColor(bot.config.embed.color)
			.setTimestamp();

		return await BotMessage.edit({
			embeds: [StatsEmbed]
		});
	},
	{
		description: "SparkV's stats.",
		dirname: __dirname,
		usage: "",
		aliases: ["ping", "pong", "up", "ram", "memory", "uptime", "latency", "data", "storage"],
		perms: [],
		slash: true
	},
);
