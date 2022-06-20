// KingCh1ll //
// Last Edited: 2/25/2021 //
// Index.js //

if (process.argv.includes("--sharding") === true) require("module-alias/register");
require("./Structures/extenders");

// Librarys //
import fs from "fs";
import path from "path";
import Statcord from "statcord.js";
import mongoose from "mongoose";
import Discord, { Collection, Intents, Permissions } from "discord.js";

import Logger from "../utils/logger";
import Client from "./Structures/client";
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
(global as any).bot = SparkV;

async function Start() {
	if (process.argv.includes("--sharding") === true) {
		if (process.env.MONGOOSEURL) {
			await mongoose.connect(process.env.MONGOOSEURL, {
				useNewUrlParser: true,
				useUnifiedTopology: true
			} as {
				bufferCommands?: boolean;
				dbName?: string;
				user?: string;
				pass?: string;
				autoIndex?: boolean;
				autoCreate?: boolean;
			});

			mongoose.connection.on("error", console.error.bind(console, "Database connection error!"));
			mongoose.connection.on("open", () => console.log("[Datebase] Connected and ready."));
		} else {
			Logger("WARNING - NO API KEY FOR MONGOOSE! SPARKV MAY BREAK WITHOUT MONGODB KEY.", "warn");
		}
	}

	await SparkV.LoadModules({ sharding: process.argv.includes("--sharding") });

	await SparkV.LoadEvents(__dirname);
	await SparkV.LoadCommands(__dirname);
}

Start();
SparkV.login(process.env.TOKEN);
