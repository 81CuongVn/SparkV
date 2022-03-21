const Discord = require("discord.js");
const dbots = require("dbots");
const { Client } = require("statcord.js");

module.exports = {
	once: true,
	async execute(bot) {
		// Start Loading
		bot.user.setPresence({
			status: "dnd",
			activities: [{ name: "Loading SparkV (100%)" }],
		});

		// Bot Lists //
		if (process.argv.includes("--dev") === false) {
			const apiKeys = {};

			if (process.env.DBLKEY) apiKeys.topgg = process.env.DBLKEY;
			if (process.env.DBL2KEY) apiKeys.discordbotlist = process.env.DBL2KEY;
			if (process.env.VBLKEY) apiKeys.voidbots = process.env.VBLKEY;
			if (process.env.DLBLKEY) apiKeys.discordlabs = process.env.DLBLKEY;
			if (process.env.DBGGKEY) apiKeys.discordbotsgg = process.env.DBGGKEY;
			if (process.env.DBL3KEY) apiKeys.DiscordBotlistEU = process.env.DBL3KEY;

			const poster = new dbots.Poster({
				client: bot,
				apiKeys,
				clientLibrary: "discord.js",
				serverCount: async () => await bot.functions.GetServerCount(),
				userCount: async () => await bot.functions.GetUserCount(),
			});

			// Start Posting to Bot Lists
			poster.post();
			poster.startInterval();
		}

		// Bot Stats
		if (bot?.StatClient) {
			bot.StatClient.post();
			bot.StatClient.autopost();
		} else {
			bot.logger("WARNING: Statcord is not installed! Statitics will not be posted.", "warning");
		}

		console.log("-------- SparkV --------");
		bot.user.setPresence({
			status: "online",
			activities: [
				{
					name: `/Help | ${bot.functions.formatNumber(await bot.functions.GetServerCount())} servers`,
					type: "PLAYING",
				},
			],
		});

		bot.logger(`[READY] Logged into Discord as ${bot.user.tag} (${bot.user.id})`);
	},
};
