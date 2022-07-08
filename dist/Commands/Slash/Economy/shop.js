"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const command_1 = __importDefault(require("../../../Structures/command"));
exports.default = new command_1.default(async (bot, message, args, command, data) => await message.replyT({
    embeds: [{
            title: `${bot.config.emojis.coin} **Shop**`,
            description: `> Select the item you'd like to buy.\n\n${bot.shop.map((item) => `> **${item.emoji ? `${item.emoji} ` : ""}${item.name.charAt(0).toUpperCase() + item.name.slice(1)}** \`[${item.ids.join(", ")}]\` - **⏣${item.price}**\n> ${item.description}`).join("\n\n")}`,
            color: discord_js_1.Colors.Blue,
            timestamp: new Date(),
            footer: {
                text: `SparkV Shop • ${bot.config.embed.footer}`,
                icon_url: bot.user.displayAvatarURL()
            }
        }],
    fetchReply: true
}), {
    description: `Displays the shop!`,
    dirname: __dirname,
    usage: "",
    aliases: [],
    perms: [],
    slash: true
});
//# sourceMappingURL=shop.js.map