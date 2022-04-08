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
			.addField(`**${await message.translate("Server")}**`, `${bot.config.emojis.rocket} ${await message.translate("CPU")}: **${(process.cpuUsage().user / 1024 * 2 / 100).toFixed(0)}%**\n${bot.config.emojis.stats} Memory: **${(((os.totalmem() - os.freemem()) / (os.totalmem())) * 100).toFixed(2)}%**`, true)
			.addField(`**${await message.translate("Bot Statistics")}**`, `${bot.config.emojis.globe} ${await message.translate("Servers")}: **${bot.functions.formatNumber(await bot.functions.GetServerCount())}**\n${bot.config.emojis.player} Users: **${bot.functions.formatNumber(await bot.functions.GetUserCount())}**`, true)
			.setFooter({
				text: `SparkV's Stats • ${bot.config.embed.footer}`,
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
