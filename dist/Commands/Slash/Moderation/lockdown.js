"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importStar(require("discord.js"));
const modCommand_1 = __importDefault(require("../../../structures/modCommand"));
async function execute(bot, message, args, command, data) {
    const state = data.options.getString("state");
    const reason = data.options.getString("reason");
    const embed = new discord_js_1.default.EmbedBuilder()
        .setAuthor({
        name: message.user.tag,
        iconURL: message.user.displayAvatarURL()
    })
        .setFooter({
        text: bot.config.embed.footer,
        iconURL: bot.user.displayAvatarURL()
    });
    const Channels = message.guild.channels.cache.filter((channel) => channel.type !== discord_js_1.ChannelType.GuildCategory);
    try {
        if (state.toLowerCase() === "on") {
            Channels.forEach((channel) => {
                channel.permissionOverwrites.create(message.guild.roles.everyone, {
                    SEND_MESSAGES: false
                });
            });
            embed
                .setDescription(`This server is on lockdown! Reason: ${reason}`)
                .setColor(discord_js_1.Colors.Red);
        }
        else if (state.toLowerCase() === "off") {
            Channels.forEach((channel) => {
                channel.permissionOverwrites.create(message.guild.roles.everyone, {
                    SEND_MESSAGES: true
                });
            });
            embed
                .setDescription(`This server is on lockdown! Reason: ${reason}`)
                .setColor(discord_js_1.Colors.Red);
        }
        else {
            await message.replyT("Invalid command usage. Please specify a valid state (on/off).");
        }
    }
    catch (err) {
        message.replyT(`${bot.config.emojis.error} | Failed to put server in lockdown. Please make sure I have the correct permissions.`);
    }
}
exports.default = new modCommand_1.default(execute, {
    description: "I'll put the server in lockdown, or disable a previous lockdown.",
    dirname: __dirname,
    aliases: [],
    usage: `<on | off>`,
    perms: ["ManageChannels"],
    bot_perms: ["ManageChannels"],
    slash: true,
    options: [
        {
            type: 3,
            name: "state",
            description: "The state of the lockdown. (on/off)",
            required: true,
            choices: [
                {
                    name: "on",
                    value: "on"
                },
                {
                    name: "off",
                    value: "off"
                }
            ]
        },
        {
            type: 3,
            name: "reason",
            description: "Reason for locking the server."
        }
    ]
});
//# sourceMappingURL=lockdown.js.map