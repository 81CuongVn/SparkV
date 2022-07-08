"use strict";
// KingCh1ll //
// Last Edited: 2/25/2021 //
// Index.js //
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./Structures/extenders");
// Librarys //
const mongoose_1 = __importDefault(require("mongoose"));
const discord_js_1 = require("discord.js");
const logger_1 = __importDefault(require("./Utils/logger"));
const client_1 = __importDefault(require("./Structures/client"));
const SparkV = new client_1.default({
    intents: [
        discord_js_1.GatewayIntentBits.DirectMessages,
        // GatewayIntentBits.DirectMessageReactions,
        // GatewayIntentBits.DirectMessageTyping,
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildBans,
        // GatewayIntentBits.GuildEmojisAndStickers,
        // GatewayIntentBits.GuildIntegrations,
        // GatewayIntentBits.GuildInvites,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
        discord_js_1.GatewayIntentBits.GuildMessageReactions,
        discord_js_1.GatewayIntentBits.GuildVoiceStates,
        // GatewayIntentBits.GUILD_WEBHOOKS,
        // GatewayIntentBits.GUILD_INTEGRATIONS,
        // GatewayIntentBits.GUILD_INVITES,
        // GatewayIntentBits.GUILD_PRESENCES,
        // GatewayIntentBits.GUILD_EMOJIS_AND_STICKERS,
        // GatewayIntentBits.GUILD_MESSAGE_TYPING,
    ],
    partials: [discord_js_1.Partials.Message, discord_js_1.Partials.Reaction]
});
global.bot = SparkV;
async function Start() {
    if (process.argv.includes("--sharding") === true) {
        if (process.env.MONGOOSEURL) {
            await mongoose_1.default.connect(process.env.MONGOOSEURL, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            mongoose_1.default.connection.on("error", console.error.bind(console, "Database connection error!"));
            mongoose_1.default.connection.on("open", () => console.log("[Datebase] Connected and ready."));
        }
        else {
            (0, logger_1.default)("WARNING - NO API KEY FOR MONGOOSE! SPARKV MAY BREAK WITHOUT MONGODB KEY.", "warn");
        }
    }
    await SparkV.LoadModules({ sharding: process.argv.includes("--sharding") });
    await SparkV.LoadEvents(__dirname);
    await SparkV.LoadCommands();
}
Start();
SparkV.login(process.env.TOKEN);
//# sourceMappingURL=app.js.map