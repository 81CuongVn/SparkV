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
    async execute(bot, guild, user) {
        const data = await bot.database.getGuild(guild.id);
        if (data?.logging?.enabled === 'true') {
            const channel = guild?.channels?.cache.get(data.logging?.channel);
            if (!channel)
                return;
            const embed = new discord_js_1.default.EmbedBuilder()
                .setAuthor({
                name: user.tag,
                iconURL: user.displayAvatarURL(),
            })
                .setDescription(`**User banned!**\n\n**User:** ${user}`)
                .setFooter({
                text: `User ID: ${user.id}`,
                iconURL: user.displayAvatarURL(),
            })
                .setColor(discord_js_1.Colors.Red)
                .setTimestamp();
            await channel
                .send({
                embeds: [embed],
            })
                .catch(() => { });
        }
    },
};
//# sourceMappingURL=guildBanAdd.js.map