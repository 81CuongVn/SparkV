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
			const poster = new dbots.Poster({
				client: bot,
				apiKeys: {
					topgg: process.env.DBLKEY,
					discordbotlist: process.env.DBL2KEY,
					voidbots: process.env.VBLKEY,
					discordlabs: process.env.DLBLKEY,
					discordbotsgg: process.env.DBGGKEY
				},
				clientLibrary: "discord.js",
				serverCount: async () => await bot.functions.GetServerCount(),
				userCount: async () => await bot.functions.GetUserCount(),
			});

			// Start Posting to Bot Lists
			poster.post();
			poster.startInterval();
		}

		// Bot Stats
		bot.StatClient.post();
		bot.StatClient.autopost();

		console.log("-------- SparkV --------");
		bot.user.setPresence({
			status: "online",
			activities: [
				{
					name: `${bot.config.prefix}Help | ${bot.functions.formatNumber(
						await bot.functions.GetServerCount(),
					)} servers`,
					type: "PLAYING",
				},
			],
		});

		bot.logger(
			`Logged into Discord as ${bot.user.tag} (${bot.user.id})\n🏢 | Servers: ${bot.functions.formatNumber(
				await bot.functions.GetServerCount(),
			)}\n👥 | Users: ${bot.functions.formatNumber(await bot.functions.GetUserCount())}`,
			"bot",
		);
	},
};
