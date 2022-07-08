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
    async execute(bot, guild) {
        if (!guild.available)
            return;
        console.log(`SparkV has been removed from ${guild.name} (Id: ${guild.id}).`);
        bot.user.setPresence({
            status: "online",
            activities: [
                {
                    name: `/help | ${bot.functions.formatNumber(await bot.functions.GetServerCount())} servers`,
                    type: "PLAYING"
                }
            ]
        });
        const Logger = bot.channels.cache.get("831314946624454656");
        const Owner = await guild?.fetchOwner().catch(() => null) || null;
        if (Logger) {
            const ServerRemovedEmbed = new discord_js_1.default.EmbedBuilder()
                .setTitle(`${bot.config.emojis.arrows.down}︱Guild Removed`)
                .setDescription(`SparkV left **${guild.name} (${guild.id})**.`)
                .addFields([
                {
                    name: `${bot.config.emojis.player} **Members**`,
                    value: `${bot.functions.formatNumber(guild.members.memberCount)}`,
                    inline: true
                }, {
                    name: "📅 **Created**",
                    value: `<t:${~~(guild.createdAt / 1000)}:R>`,
                    inline: true
                }
            ])
                .setThumbnail(guild.iconURL())
                .setImage(guild.bannerURL())
                .setColor(discord_js_1.Colors.Red);
            if (guild.vanityURLCode) {
                ServerRemovedEmbed
                    .setURL(`https://discord.gg/${guild.vanityURLCode}`)
                    .addFields([{ name: "🔗 **Vanity URL**", value: `https://discord.gg/${guild.vanityURLCode}`, inline: true }]);
            }
            if (Owner) {
                ServerRemovedEmbed.setAuthor({
                    name: Owner?.user?.username,
                    iconURL: Owner?.user?.displayAvatarURL()
                });
            }
            Logger.send({
                embeds: [ServerRemovedEmbed]
            });
        }
    }
};
//# sourceMappingURL=guildDelete.js.map