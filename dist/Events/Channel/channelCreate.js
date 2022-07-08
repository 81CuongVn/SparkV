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
    async execute(bot, channel) {
        if (!bot.application?.owner)
            await bot.application?.fetch().catch(() => { });
        if (channel?.partial)
            await channel.fetch().catch(() => { });
        const data = await bot.database.getGuild(channel.guildId);
        if (data?.logging?.enabled === "true") {
            const logChannel = channel?.guild?.channels?.cache?.get(data.logging?.channel);
            if (!logChannel)
                return;
            const embed = new discord_js_1.default.EmbedBuilder()
                .setDescription(`**Channel Created ${channel}**`)
                .setFooter({
                text: `Channel ID: ${channel.id}`,
                iconURL: bot.user.displayAvatarURL()
            })
                .setColor(discord_js_1.Colors.Green)
                .setTimestamp();
            await logChannel.send({
                embeds: [embed]
            }).catch(() => { });
        }
    },
};
//# sourceMappingURL=channelCreate.js.map