const os = require("os");
const Discord = require("discord.js");

const cmd = require("../../templates/command");

module.exports = new cmd(
	async (bot, message) => {
		const BotMessage = await message.replyT("Fetching Stats...");
		let footerMessage = `SparkV's Stats • ${bot.config.embed.footer}`;

		if (bot.functions.MSToTime(bot.uptime) === "5 Minutes") footerMessage = "pog you found me lol great job on timing it on exactly 5 minutes";

		const UsedMemory = os.totalmem() - os.freemem();
		const TotalMemory = os.totalmem();
		const MemoryPersentage = `${((UsedMemory / TotalMemory) * 100).toFixed(2)}%`;

		const LocalPing = new Date().getTime() - message.createdTimestamp;
		const APIPing = bot.ws.ping;

		const StatsEmbed = new Discord.MessageEmbed()
			.setTitle("📊 Stats 📊")
			.addField("**LATENCY**", `\`\`\`SparkV: ${LocalPing}ms\nAPI: ${APIPing}ms\`\`\``, true)
			.addField(
				"**STORAGE**",
				`\`\`\`Memory: ${(UsedMemory / Math.pow(1024, 3)).toFixed(2)}/${(TotalMemory / Math.pow(1024, 3)).toFixed(
					2,
				)} (${MemoryPersentage}) MB\nRAM: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}/${(
					process.memoryUsage().heapTotal /
          1024 /
          1024
				).toFixed(2)}MB\`\`\``,
				true,
			)
			.addField(
				"**DATA**",
				`\`\`\`Uptime: ${bot.functions.MSToTime(bot.uptime)}\nServers: ${bot.functions.formatNumber(
					await bot.functions.GetServerCount(),
				)}\nUsers: ${bot.functions.formatNumber(await bot.functions.GetUserCount())}\`\`\``,
				true,
			)
			.setFooter(footerMessage)
			.setColor(bot.config.embed.color)
			.setTimestamp();

		console.log(BotMessage);
		return await BotMessage.edit({
			content: "Loading complete!",
			embeds: [StatsEmbed],
		});
	},
	{
		description: "SparkV's stats.",
		dirname: __dirname,
		usage: "",
		aliases: ["ping", "pong", "up", "ram", "memory", "uptime", "latency", "data", "storage"],
		perms: ["EMBED_LINKS"],
	},
);
