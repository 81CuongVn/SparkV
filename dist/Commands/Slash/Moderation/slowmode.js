"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const modCommand_1 = __importDefault(require("../../../structures/modCommand"));
async function execute(bot, message, args, command, data) {
    const channel = data.options.getChannel("channel");
    const seconds = data.options.getNumber("seconds");
    if (seconds > 21600)
        return await message.replyT(`${bot.config.emojis.error} | That's too high of a number! The maximum I can set that channel to is **6 hours** do to Discord API limits.`);
    try {
        channel.setRateLimitPerUser(seconds);
        await message.replyT(`${bot.config.emojis.success} | Slowmode is now ${seconds} seconds.`);
    }
    catch (err) {
        return await message.replyT(`${bot.config.emojis.error} | I cannot set the slowmode for this channel! Please check my permissions and try again.`);
    }
}
exports.default = new modCommand_1.default(execute, {
    description: "Applies a slowmode to a channel.",
    dirname: __dirname,
    aliases: ["slow"],
    usage: `(user) (reason)`,
    perms: ["ManageChannels"],
    bot_perms: ["ManageChannels"],
    slash: true,
    options: [{
            type: 7,
            name: "channel",
            description: "The channel to apply a slowmode too.",
            required: true
        }, {
            type: 10,
            name: "seconds",
            description: "The amount of seconds to set the slowmode to.",
            required: true
        }]
});
//# sourceMappingURL=slowmode.js.map