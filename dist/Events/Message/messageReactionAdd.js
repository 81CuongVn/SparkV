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
/* eslint-disable no-case-declarations */
const discord_js_1 = __importStar(require("discord.js"));
exports.default = {
    once: false,
    async execute(bot, reaction, user) {
        if (reaction?.partial)
            await reaction?.fetch().catch(() => { });
        if (reaction.message?.partial)
            await reaction?.message?.fetch().catch(() => { });
        const message = reaction.message;
        const data = await bot.database.getGuild(message.guildId);
        switch (reaction.emoji.name) {
            case data.starboard?.emoji || "⭐":
                if (data.starboard?.enabled === "true") {
                    if ((reaction.count >= (parseInt(data.starboard?.min) || 2)) === false)
                        return;
                    const channel = message.guild.channels.cache.find((c) => c.id === data.starboard?.channel);
                    if (!channel)
                        return;
                    let fetchedMessages = await channel.messages.fetch({ limit: 100 });
                    fetchedMessages = fetchedMessages.filter((m) => {
                        if (m?.embeds?.length > 0)
                            return true;
                        else
                            return false;
                    });
                    const stars = fetchedMessages.find((m) => m.embeds[0]?.description?.includes(message.url));
                    if (stars) {
                        const foundStar = stars.embeds[0];
                        const msg = await channel.messages.fetch(stars.id);
                        const embed = new discord_js_1.default.EmbedBuilder()
                            .setAuthor({
                            name: message.author.tag,
                            iconURL: message.author.displayAvatarURL()
                        })
                            .setDescription(`[${message.channel.name}](${message.url}) | ${data.starboard?.emoji} **${reaction.count}**${foundStar?.description.includes("\n\n") ? `\n\n${foundStar?.description.split(`\n\n`)[1]}` : ""}`)
                            .setImage(message.attachments.first()?.url || null)
                            .setColor(foundStar.color)
                            .setTimestamp();
                        const starMsg = await channel.messages.fetch(stars.id);
                        await msg.edit({
                            embeds: [embed]
                        }).catch(() => { });
                    }
                    else {
                        const embed = new discord_js_1.default.EmbedBuilder()
                            .setAuthor({
                            name: message.author.tag,
                            iconURL: message.author.displayAvatarURL()
                        })
                            .setDescription(`[${message.channel.name}](${message.url}) | ${data.starboard?.emoji} **${reaction.count}**${message?.content ? `\n\n${message?.content}` : ""}`)
                            .setImage(message.attachments.first()?.url || null)
                            .setColor(discord_js_1.Colors.Blue)
                            .setTimestamp();
                        await channel?.send({
                            embeds: [embed]
                        }).catch(() => { });
                    }
                }
        }
    }
};
//# sourceMappingURL=messageReactionAdd.js.map