"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __importDefault(require("../../../structures/command"));
const Emotes = ["🥇", "🥈", "🥉"];
async function execute(bot, message, args, command, data) {
    const type = data.options.getString("type");
    if (type === "leveling") {
        if (data.guild.leveling.enabled === "false")
            return await message.replyT("Leveling is disabled. Please enable it on the settings panel.");
        let TopMembers = await bot.MemberSchema.find({ guildID: message.guild.id }).sort([["xp", "descending"]]).exec();
        TopMembers = TopMembers.slice(0, 10);
        const Leaderboard = [];
        for (const data of TopMembers) {
            const user = await bot.users.fetch(data.id) || { username: "Unknown", discriminator: "0000" };
            Leaderboard.push({
                id: data.id,
                xp: data.xp,
                level: data.level,
                rank: TopMembers.findIndex((i) => i.guildID === data.guildID && i.id === data.id) + 1,
                username: user.username,
                discriminator: user.discriminator
            });
        }
        await message.replyT({
            embeds: [{
                    title: `${message.guild.name}'s Level Leaderboard`,
                    description: Leaderboard.map(data => `${Emotes[data.rank - 1] || "🏅"} **Level ${data.level}** - ${data.username}#${data.discriminator}`).join("\n"),
                    color: "BLUE",
                    timestamp: new Date(),
                    footer: {
                        text: `${bot.user.username} • ${bot.config.embed.footer}`,
                        iconURL: bot.user.displayAvatarURL()
                    }
                }]
        });
    }
    else if (type === "money") {
        const global = data.options.getBoolean("global") || false;
        let Leaderboard = await bot.UserSchema.find({});
        Leaderboard = Leaderboard
            .sort((a, b) => b.money.balance - a.money.balance)
            .filter((user) => bot.users.cache.has(user.id))
            .slice(0, 10);
        if (global === false)
            Leaderboard = Leaderboard.filter((user) => message.guild.members.cache.has(user.id));
        let rank = 0;
        await message.replyT({
            embeds: [{
                    title: `${message.guild.name}'s Money Leaderboard`,
                    description: Leaderboard.map(async (data) => {
                        rank++;
                        const user = await bot.users.fetch(data.id);
                        return `${Emotes[rank - 1] || "🏅"} **⏣${bot.functions.formatNumber(data.money.balance)}** - ${user.tag}`;
                    }).join("\n"),
                    color: "GREEN",
                    timestamp: new Date(),
                    footer: {
                        text: `${bot.user.username} • ${bot.config.embed.footer}`,
                        icon_url: bot.user.displayAvatarURL()
                    }
                }]
        });
    }
}
exports.default = new command_1.default(execute, {
    description: "View the top 10 users for leveling and money.",
    dirname: __dirname,
    aliases: [],
    usage: "",
    slash: true,
    options: [
        {
            type: 3,
            name: "type",
            description: "The type of leaderboard to view.",
            required: true,
            choices: [
                {
                    name: "leveling",
                    value: "leveling"
                },
                {
                    name: "money",
                    value: "money"
                }
            ]
        },
        {
            type: 5,
            name: "global",
            description: "Whether we should show you the global money leaderboard instead of the server money leaderboard."
        }
    ]
});
//# sourceMappingURL=leaderboard.js.map