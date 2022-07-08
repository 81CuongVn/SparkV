"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const command_1 = __importDefault(require("./command"));
class ModCommand {
    constructor(execute, sett) {
        this.execute = execute;
        this.settings = new command_1.default(execute, Object.assign({ cooldown: 2 * 1000 }, sett)).settings;
    }
    async run(bot, message, args, command, data) {
        const perms = message.channel.permissionsFor(message.user ? message.user : message.author);
        for (const perm of this.settings.perms) {
            if (!perms.has(discord_js_1.PermissionsBitField.Flags[perm])) {
                const table = {
                    content: `${bot.config.emojis.error} | Uh oh! You're missing the \`${perm}\` permission!`,
                    ephemeral: true,
                };
                return message?.applicationId ? await message.editT(table) : await message.replyT(table);
            }
        }
        const botperms = message.channel.permissionsFor(message.guild.members.cache.get(bot.user.id));
        for (const perm of this.settings.bot_perms) {
            if (!botperms.has(discord_js_1.PermissionsBitField.Flags[perm])) {
                return await message.replyT({
                    content: `${bot.config.emojis.error} | Uh oh! I'm missing the \`${perm}\` permission!`,
                    ephemeral: true,
                });
            }
        }
        return this.execute(bot, message, args, command, data);
    }
}
exports.default = ModCommand;
;
//# sourceMappingURL=modCommand.js.map