const Discord = require("discord.js");
const dbots = require("dbots");
const { Client } = require("statcord.js");

module.exports = {
	once: true,
	async execute(bot) {
		bot.user.setPresence({
			status: "online",
			activities: [
				{
					name: `/help | ${bot.functions.formatNumber(await bot.functions.GetServerCount())} servers`,
					type: "PLAYING"
				}
			]
		});

		bot.logger(`[App] Connected to Discord as ${bot.user.tag}.`);
		bot.logger(`[App] Playing with ${bot.functions.formatNumber(await bot.functions.GetServerCount())} guilds and ${bot.functions.formatNumber(await bot.functions.GetUserCount())}.`);

		// Bot Lists //
		if (process.argv.includes("--dev") === false) {
			const apiKeys = {};

			if (process.env.DBLKEY) apiKeys.topgg = process.env.DBLKEY;
			if (process.env.VBLKEY) apiKeys.voidbots = process.env.VBLKEY;
			if (process.env.DLBLKEY) apiKeys.discordlabs = process.env.DLBLKEY;
			if (process.env.DBGGKEY) apiKeys.discordbotsgg = process.env.DBGGKEY;
			if (process.env.DBLEUKEY) apiKeys.DiscordBotlistEU = process.env.DBLEUKEY;

			const poster = new dbots.Poster({
				client: bot,
				apiKeys,
				clientLibrary: "discord.js",
				serverCount: async () => await bot.functions.GetServerCount(),
				userCount: async () => await bot.functions.GetUserCount()
			});

			// Start Posting to Bot Lists
			poster.post();
			poster.startInterval();

			bot.logger(`[App] Botlist statistics posting started.`);
		}

		// Bot Stats
		if (bot?.StatClient) {
			bot.StatClient.post(process.argv.includes("--sharding") === true && bot);

			bot.logger("[Statcord] Statcord ready, now posting statistics.");
		} else {
			bot.logger("[Statcord] WARNING: Statcord is not installed! Statitics will not be posted.", "warning");
		}
	}
};
