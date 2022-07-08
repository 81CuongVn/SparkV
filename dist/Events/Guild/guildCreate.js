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
        console.log(`SparkV has been added to ${guild.name} (Id: ${guild.id}).`);
        bot.user.setPresence({
            status: "online",
            activities: [{
                    name: `/help | ${bot.functions.formatNumber(await bot.functions.GetServerCount())} servers`,
                    type: "PLAYING"
                }]
        });
        const Logger = bot.channels.cache.get("831314946624454656");
        const Owner = await guild?.fetchOwner().catch(() => null) || null;
        if (Logger) {
            const ServerAddedEmbed = new discord_js_1.default.EmbedBuilder()
                .setTitle(`${bot.config.emojis.arrows.up}︱Guild Added`)
                .setDescription(`SparkV has joined **${guild.name} (${guild.id})**!`)
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
                .setColor(discord_js_1.Colors.Green);
            if (guild.vanityURLCode) {
                ServerAddedEmbed
                    .setURL(`https://discord.gg/${guild.vanityURLCode}`)
                    .addFields([{ name: "🔗 **Vanity URL**", value: `https://discord.gg/${guild.vanityURLCode}`, inline: true }]);
            }
            if (Owner) {
                ServerAddedEmbed.setAuthor({
                    name: Owner?.user?.username,
                    iconURL: Owner?.user?.displayAvatarURL()
                });
            }
            Logger.send({ embeds: [ServerAddedEmbed] });
        }
        if (guild.systemChannel) {
            const WelcomeEmbed = new discord_js_1.default.EmbedBuilder()
                .setDescription(`I'm a powerful Discord bot with the purpose to make your server better and more unique, without making things complicated. I have many features which have been proven to boost your server's activity. If you want to setup/configure SparkV, you can type \`/settings\`.\n\nSimply type the command \`/help\` to get a list of my commands.\nIf you have any questions, feel free to join our [Discord server](https://discord.gg/PPtzT8Mu3h).`)
                .setThumbnail(bot.user.displayAvatarURL())
                .setImage("https://www.sparkv.tk/images/banner.gif")
                .setColor(discord_js_1.Colors.Blue)
                .setTimestamp();
            if (Owner) {
                WelcomeEmbed.setAuthor({
                    name: Owner?.user?.tag,
                    iconURL: Owner?.user?.displayAvatarURL()
                });
            }
            const InviteButton = new discord_js_1.default.ButtonBuilder()
                .setURL(bot.config.bot_invite)
                .setEmoji(bot.config.emojis.plus)
                .setLabel("Invite")
                .setStyle(discord_js_1.ButtonStyle.Link);
            const SupportButton = new discord_js_1.default.ButtonBuilder()
                .setURL(bot.config.support)
                .setEmoji(bot.config.emojis.question)
                .setLabel("Support")
                .setStyle(discord_js_1.ButtonStyle.Link);
            const WebsiteButton = new discord_js_1.default.ButtonBuilder()
                .setURL("https://www.sparkv.tk/")
                .setEmoji(bot.config.emojis.globe)
                .setLabel("Website")
                .setStyle(discord_js_1.ButtonStyle.Link);
            await guild.systemChannel.send({
                embeds: [WelcomeEmbed],
                components: [{ type: 1, components: [InviteButton, SupportButton, WebsiteButton] }]
            }).catch((err) => console.log(`Failed to send message to ${guild.name} (${guild.id})! ${err.message}`));
        }
    }
};
//# sourceMappingURL=guildCreate.js.map