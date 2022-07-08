"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    once: false,
    async execute(bot, oldM, newM) {
        await bot.emit("messageCreate", newM);
        if (!newM.editedAt)
            return;
        if (newM.author.bot)
            return;
        if (!oldM.content || !newM.content)
            return;
        if (newM.content.length > 1024)
            return;
        if (newM.content === oldM.content)
            return;
        if (newM.content.includes("@everyone") || newM.content.includes("@here"))
            newM.content = newM.cleanContent;
        const data = await bot.database.getGuild(newM.guildId);
        if (data?.logging?.enabled === "true") {
            const channel = newM.channel?.guild?.channels?.cache.get(data.logging?.channel);
            if (!channel)
                return;
            await channel.send({
                embeds: [{
                        author: { name: newM.author.tag, icon_url: newM.author.displayAvatarURL() },
                        description: `**Message Edited in ${newM.channel}**`,
                        fields: [{
                                name: "Before",
                                value: oldM?.content,
                                inline: true
                            }, {
                                name: "After",
                                value: newM?.content,
                                inline: true
                            }],
                        footer: { text: `User ID: ${newM.author.id} | Message ID: ${newM.id}`, icon_url: newM.author.displayAvatarURL() },
                        color: discord_js_1.Colors.Yellow,
                        timestamp: new Date()
                    }]
            }).catch(() => { });
        }
    },
};
//# sourceMappingURL=messageUpdate.js.map