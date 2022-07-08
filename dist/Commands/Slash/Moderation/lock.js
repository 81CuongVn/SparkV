"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const modCommand_1 = __importDefault(require("../../../structures/modCommand"));
async function execute(bot, message, args, command, data) {
    const reason = (message?.applicationId ? data.options.getString("reason") : args.join(" ")) || "No reason provided.";
    try {
        await message.guild.roles.cache.forEach((role) => message.channel.permissionOverwrites.create(role, { SEND_MESSAGES: false }));
        return await message.replyT({
            embeds: [{
                    author: {
                        name: message.user.tag,
                        icon_url: message.user.displayAvatarURL()
                    },
                    description: `This channel has been locked. Reason: ${reason}`,
                    color: discord_js_1.Colors.Red,
                    timestamp: new Date()
                }]
        });
    }
    catch (err) {
        bot.logger(err, "error");
        message.replyT(`${bot.config.emojis.error} | Failed to lock channel. Please make sure I have the correct permissions.`);
    }
}
exports.default = new modCommand_1.default(execute, {
    description: "I'll lock the current channel.",
    dirname: __dirname,
    aliases: [],
    usage: "",
    perms: ["ManageChannels"],
    bot_perms: ["ManageChannels"],
    slash: true,
    options: [
        {
            type: 3,
            name: "reason",
            description: "Reason for locking the server.",
        },
    ]
});
//# sourceMappingURL=lock.js.map