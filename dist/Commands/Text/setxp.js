"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __importDefault(require("../../structures/command"));
async function execute(bot, message, args, command, data) {
    const User = await bot.functions.fetchUser(args[0]);
    if (data.leveling.enabled === "true") {
        const userData = await bot.database.getMember(User.id);
        try {
            userData.xp = args[1];
            userData.level = Math.floor(0.1 * Math.sqrt(parseInt(args[1])));
            await userData.save();
            await message.replyT(`${bot.config.emojis.success} | Successfully set ${User}'s XP to ${bot.functions.formatNumber(args[1])}!`);
        }
        catch (err) {
            bot.logger(err, "error");
            await message.replyT(`${bot.config.emojis.error} | Error setting ${User}'s XP to ${bot.functions.formatNumber(args[1])}.`);
        }
    }
    else {
        return await message.replyT(`${bot.config.emojis.error} | Leveling is not enabled for this server. Please enable it by doing \`(prefix)Leveling on\`!`);
    }
}
exports.default = new command_1.default(execute, {
    description: `Set XP.`,
    aliases: [],
    dirname: __dirname,
    usage: `(user) <ammount>`,
    ownerOnly: true
});
//# sourceMappingURL=setxp.js.map