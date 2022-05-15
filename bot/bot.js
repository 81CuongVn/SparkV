// KingCh1ll //
// Last Edited: 2/25/2021 //
// Index.js //

if (process.argv.includes("--sharding") === true) require("module-alias/register");
require("./structures/extenders");

// Librarys //
const fs = require("fs");
const path = require("path");
const Statcord = require("statcord.js");
const Sentry = require("@sentry/node");
const mongoose = require("mongoose");
const { Collection, Intents, Permissions } = require("discord.js");

const PackageInfo = require("../package.json");

const Client = require("./structures/client");
const SparkV = new Client({
	intents: [
		Intents.FLAGS.DIRECT_MESSAGES,
		// Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
		// Intents.FLAGS.DIRECT_MESSAGE_TYPING
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILD_BANS
		// Intents.FLAGS.GUILD_WEBHOOKS,
		// Intents.FLAGS.GUILD_INTEGRATIONS,
		// Intents.FLAGS.GUILD_INVITES,
		// Intents.FLAGS.GUILD_PRESENCES,
		// Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		// Intents.FLAGS.GUILD_MESSAGE_TYPING,
	],
	partials: ["MESSAGE", "REACTION"],
	presence: {
		activity: {
			name: `Loading SparkV (99%)`,
			type: "PLAYING"
		},
		status: "dnd"
	}
});
global.bot = SparkV;

async function Start() {
	if (process.argv.includes("--sharding") === true) {
		if (process.env.SENTRYTOKEN) {
			Sentry.init({
				dsn: process.env.SENTRYTOKEN,
				release: `${PackageInfo.name}@${PackageInfo.version}`
			});
		} else {
			Logger("WARNING - NO API KEY FOR SENTRY! SPARKV MAY BREAK WITHOUT SENTRY LOGGING KEY.", "warn");
		}

		if (process.env.MONGOOSEURL) {
			await mongoose.connect(process.env.MONGOOSEURL, {
				useNewUrlParser: true,
				useUnifiedTopology: true
			});
		} else {
			Logger("WARNING - NO API KEY FOR MONGOOSE! SPARKV MAY BREAK WITHOUT MONGODB KEY.", "warn");
		}
	}

	mongoose.connection.on("error", console.error.bind(console, "Database connection error!"));
	mongoose.connection.on("open", () => Logger("DATABASE - ONLINE"));

	await SparkV.LoadModules({
		sharding: process.argv.includes("--sharding")
	});

	await SparkV.LoadEvents(__dirname);
	await SparkV.LoadCommands(__dirname);
}

Start();
SparkV.login(process.env.TOKEN);
