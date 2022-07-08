// KingCh1ll //
// Last Edited: 2/25/2021 //
// Index.js //

import "./Structures/extenders";

// Librarys //
import mongoose from "mongoose";
import { GatewayIntentBits, Partials } from "discord.js";

import Logger from "./Utils/logger";
import Client from "./Structures/client";
const SparkV = new Client({
	intents: [
		GatewayIntentBits.DirectMessages,
		// GatewayIntentBits.DirectMessageReactions,
		// GatewayIntentBits.DirectMessageTyping,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildBans,
		// GatewayIntentBits.GuildEmojisAndStickers,
		// GatewayIntentBits.GuildIntegrations,
		// GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildVoiceStates,
		// GatewayIntentBits.GUILD_WEBHOOKS,
		// GatewayIntentBits.GUILD_INTEGRATIONS,
		// GatewayIntentBits.GUILD_INVITES,
		// GatewayIntentBits.GUILD_PRESENCES,
		// GatewayIntentBits.GUILD_EMOJIS_AND_STICKERS,
		// GatewayIntentBits.GUILD_MESSAGE_TYPING,
	],
	partials: [ Partials.Message, Partials.Reaction ]
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
	await SparkV.LoadCommands();
}

Start();
SparkV.login(process.env.TOKEN);
