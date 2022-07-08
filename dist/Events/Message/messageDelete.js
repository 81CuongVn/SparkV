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
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importStar(require("discord.js"));
exports.default = {
    once: false,
    async execute(bot, message) {
        // If the application owner isn't ready yet, wait for it.
        if (!bot.application?.owner)
            await bot.application?.fetch().catch(() => { });
        // If the message is a partial, wait for the message to fetch.
        if (message?.partial)
            await message.fetch().catch(() => { });
        // If the channel is a partial, wait for the channel to fetch.
        if (message.channel?.partial)
            await message.channel.fetch().catch(() => { });
        if (!message?.content)
            return;
        if (message?.author?.bot)
            return;
        if (message?.content.length < 2)
            return;
        if (message?.content.length > 500)
            message.content = `${message?.content.slice(0, 96)}...`;
        if (message?.content.includes("@everyone") || message?.content.includes("@here"))
            message.content = message.cleanContent;
        const data = await bot.database.getGuild(message.guildId);
        if (data?.logging?.enabled === "true") {
            const channel = message.channel?.guild?.channels?.cache.get(data.logging?.channel);
            if (!channel)
                return;
            const embed = new discord_js_1.default.EmbedBuilder()
                .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL()
            })
                .setDescription(`**Message Deleted in ${message.channel}**`)
                .addFields([{ name: "Content", value: message.content, inline: true }])
                .setFooter({
                text: `User ID: ${message.author.id} | Message ID: ${message.id}`,
                iconURL: message.author.displayAvatarURL()
            })
                .setColor(discord_js_1.Colors.Red)
                .setTimestamp();
            await channel.send({
                embeds: [embed]
            }).catch(() => { });
        }
    }
};
//# sourceMappingURL=messageDelete.js.map