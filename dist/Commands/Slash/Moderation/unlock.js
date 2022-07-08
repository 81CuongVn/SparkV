"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const modCommand_1 = __importDefault(require("../../../structures/modCommand"));
async function execute(bot, message, args, command, data) {
    try {
        await message.guild.roles.cache.forEach((role) => message.channel.permissionOverwrites.create(role, { SEND_MESSAGES: true }));
        return await message.replyT({
            embeds: [{
                    author: {
                        name: message?.user?.tag,
                        iconURL: message?.user?.displayAvatarURL()
                    },
                    description: "**Unlocked**\nThis channel has been unlocked!",
                    color: "GREEN"
                }]
        });
    }
    catch (err) {
        message.replyT(`${bot.config.emojis.alert} | Failed to unlock channel. Please make sure I have the correct permissions.`);
    }
}
exports.default = new modCommand_1.default(execute, {
    description: "I'll unlock the current channel.",
    dirname: __dirname,
    aliases: ["ulock"],
    usage: "",
    perms: ["ManageChannels"],
    bot_perms: ["ManageChannels"],
    slash: true
});
//# sourceMappingURL=unlock.js.map