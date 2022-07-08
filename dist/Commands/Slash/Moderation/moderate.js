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
async function execute(bot, interaction, args, command, data) {
    const action = data.options.getString("action");
    const user = data.options.getMember("user");
    const reason = data.options.getString("reason") || "No reason provided.";
    if ((user.user ? user.user : user).id === interaction.user.id)
        return await interaction.editT(`${bot.config.emojis.error} | Nice try, you cannot moderate yourself.`);
    if (!bot.config.owners.includes(interaction.user.id) && !interaction.member.roles.highest.position > user.roles.highest.position)
        return await interaction.editT(`${bot.config.emojis.alert} | Uh oh... I can\`t warn this user! This user is either the owner, or is a higher rank than SparkV.`);
    if (!user.moderatable)
        return interaction.editT(`${bot.config.emojis.alert} | I cannot moderate this user.`);
    const embed = new discord_js_1.default.EmbedBuilder()
        .setAuthor({
        name: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL()
    })
        .setColor(discord_js_1.Colors.Green)
        .setTimestamp();
    if (action === "warn") {
        const memberData = await bot.database.getMember((user.user ? user.user : user).id, interaction.guild.id);
        ++memberData.infractionsCount;
        memberData.infractions.push({
            type: reason,
            date: Date.now()
        });
        memberData.markModified("infractionsCount");
        memberData.markModified("infractions");
        await memberData.save();
        user.send(`${bot.config.emojis.warning} | You were warned in **${interaction.guild.name}**. **${reason}**`)
            .catch(async () => await interaction.replyT(`${user}, you were warned in **${interaction.guild.name}**. I would've sent this to you in your DMs, but they were off. ${reason}.`));
        embed.setDescription(`**${bot.config.emojis.alert} | Warn Successful**\nSuccessfully warned ${user}. **${reason}**`).setColor(discord_js_1.Colors.Green);
        bot.emit("userWarnAdd", interaction.guild, user, reason);
    }
    else if (action === "kick") {
        user.send(`${bot.config.emojis.alert} | You have been kicked from ${interaction.guild.name}. **${reason}**.`).catch(() => { });
        user.kick({ reason }).catch(async () => await interaction.editT(`${bot.config.emojis.error} | Failed to kick user. Please check my permisions and try again.`));
        embed.setDescription(`**${bot.config.emojis.alert} | Warn Successful**\nSuccessfully warned ${user}. **${reason}*.`);
    }
    else if (action === "ban") {
        user.send(`${bot.config.emojis.alert} | You have been banned from **${interaction.guild.name}**. **${reason}**`).catch(() => { });
        user.ban({ reason }).catch(async () => await interaction.editT(`${bot.config.emojis.error} | Failed to ban user. Please check my permissions and try again.`));
        embed.setDescription(`**${bot.config.emojis.alert} | Ban Successful**\nSuccessfully banned ${user}. **${reason}*`);
    }
    await interaction.editT({
        embeds: [embed]
    });
}
exports.default = new modCommand_1.default(execute, {
    description: "Moderate a user. (Warn/Kick/Ban)",
    dirname: __dirname,
    aliases: [],
    usage: "(user) (reason)",
    perms: ["ModerateMembers"],
    bot_perms: ["ModerateMembers"],
    slash: true,
    ephemeral: true,
    options: [
        {
            type: 3,
            name: "action",
            description: "The action to take. (Warn/Kick/Ban)",
            required: true,
            choices: [
                {
                    name: "warn",
                    value: "warn"
                },
                {
                    name: "kick",
                    value: "kick"
                },
                {
                    name: "ban",
                    value: "ban"
                }
            ]
        },
        {
            type: 6,
            name: "user",
            description: "The user to kick.",
            required: true
        },
        {
            type: 3,
            name: "reason",
            description: "The reason for moderating this user."
        }
    ]
});
//# sourceMappingURL=moderate.js.map