// KingCh1ll //
// Last Edited: 2/25/2021 //
// Index.js //

// Run Client Extender
require("./structures/extenders");

// Librarys //
const fs = require("fs");
const path = require("path");
const Statcord = require("statcord.js");
const { Collection, Intents, Permissions, Options } = require("discord.js");

const Client = require("./structures/client");
const SparkV = new Client({
	intents: [
		// Intents.FLAGS.DIRECT_MESSAGES,
		// Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_BANS,
		Intents.FLAGS.GUILD_WEBHOOKS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_PRESENCES,
	],
	allowedMentions: {
		parse: ["users"],
		repliedUser: true,
	},
	presence: {
		activity: {
			name: `Loading SparkV (99%)`,
			type: "PLAYING",
		},
		status: "dnd",
	}
});
global.bot = SparkV;

async function Start() {
	await SparkV.LoadEvents(__dirname);
	await SparkV.LoadCommands(__dirname);

	await SparkV.LoadModules({
		sharding: process.execArgv.includes("--sharding"),
		docsPath: process.env.MainDir
	});

	setTimeout(async () => await SparkV.LoadSlashCommands(), 25 * 1000);

	SparkV.SocketioClient = require("socket.io-client").connect(
		`https://${process.env.BASEURL}/api/communication?token=8010405464675`,
		{
			reconnection: true,
			reconnectionDelay: 2000,
			reconnectionDelayMax: 5000,
			reconnectionAttempts: Infinity,
		},
	);

	SparkV.SocketioClient.on("connect", () => console.log("Website connected successfully."));
}

Start();
SparkV.login(process.env.TOKEN);
