const os = require("os");
const Discord = require("discord.js");

const cmd = require("@templates/command");

module.exports = new cmd(
	async (bot, message) => {
		const BotMessage = await message.replyT(`${bot.config.emojis.stats} | Fetching stats...`);

		const UsedMemory = os.totalmem() - os.freemem();
		const TotalMemory = os.totalmem();
		const MemoryPersentage = `${((UsedMemory / TotalMemory) * 100).toFixed(2)}%`;

		// RamData = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}/${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)

		const StatsEmbed = new Discord.MessageEmbed()
			.setAuthor({
				name: (message.user ? message.user : message.author).tag,
				iconURL: (message.user ? message.user : message.author).displayAvatarURL({ dynamic: true })
			})
			.addField(`${bot.config.emojis.stats} **LATENCY**`, `\`\`\`SparkV: ${new Date().getTime() - message.createdTimestamp}ms\nAPI: ${bot.ws.ping}ms\`\`\``, true)
			.addField(`${bot.config.emojis.memory} **MEMORY**`, `\`\`\`${(UsedMemory / Math.pow(1024, 3)).toFixed(2)}/${(TotalMemory / Math.pow(1024, 3)).toFixed(2)} (${MemoryPersentage}) MB\`\`\``, true)
			.addField(`${bot.config.emojis.servers} **SERVERS**`, `\`\`\`${bot.functions.formatNumber(await bot.functions.GetServerCount())}\`\`\``, true)
			.addField(`${bot.config.emojis.player} **USERS**`, `\`\`\`${bot.functions.formatNumber(await bot.functions.GetUserCount())}\`\`\``, true)
			.addField(`${bot.config.emojis.clock} **UPTIME**`, `\`\`\`${bot.functions.MSToTime(bot.uptime)}\`\`\``, true)
			.setFooter({
				text: `SparkV's Stats • ${bot.config.embed.footer}`,
				iconURL: bot.user.displayAvatarURL({ dynamic: true })
			})
			.setColor(bot.config.embed.color)
			.setTimestamp();

		return await BotMessage.edit({
			content: `${bot.config.emojis.success} Loading complete!`,
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
