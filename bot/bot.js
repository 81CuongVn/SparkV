// KingCh1ll //
// Last Edited: 2/25/2021 //
// Index.js //

// Run Client Extender
require("./structures/extenders");

// Librarys //
const fs = require("fs");
const path = require("path");
const Statcord = require("statcord.js");
const { GatewayIntentBits, Partials } = require("discord.js");

const Client = require("./structures/client");
const SparkV = new Client({
	intents: [
		// GatewayIntentBits.Flags.DIRECT_MESSAGES,
		// GatewayIntentBits.Flags.DIRECT_MESSAGE_REACTIONS,
		// GatewayIntentBits.Flags.DIRECT_MESSAGE_TYPING
		GatewayIntentBits.Guilds,
		// GatewayIntentBits.Flags.GUILD_MEMBERS,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildBans
		// GatewayIntentBits.Flags.GUILD_WEBHOOKS,
		// GatewayIntentBits.Flags.GUILD_INTEGRATIONS,
		// GatewayIntentBits.Flags.GUILD_INVITES,
		// GatewayIntentBits.Flags.GUILD_PRESENCES,
		// GatewayIntentBits.Flags.GUILD_EMOJIS_AND_STICKERS,
		// GatewayIntentBits.Flags.GUILD_MESSAGE_TYPING,
	],
	partials: [
		Partials.Message,
		Partials.Reaction
	],
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
	await SparkV.LoadModules({
		sharding: process.execArgv.includes("--sharding")
	});

	await SparkV.LoadEvents(__dirname);
	await SparkV.LoadCommands(__dirname);
}

Start();
SparkV.login(process.env.TOKEN);
