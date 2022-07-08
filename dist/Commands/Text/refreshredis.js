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
const command_1 = __importDefault(require("../../structures/command"));
async function execute(bot, message, args, command, data) {
    const LoadingMsg = await message.replyT(`Refreshing Redis cache...`);
    try {
        bot.commands
            .filter((command) => command.category.toLowerCase() === "reddit")
            .forEach(async (command) => {
            await bot.redis.del(command.settings.endpoint, (err, response) => {
                if (response === 1)
                    message.replyT(`${bot.config.emojis.success} | ${command.name} done.`);
                else
                    message.replyT(`${bot.config.emojis.error} | Uh oh! ${command.name}'s cache failed to be purged. You will have to do this manually.`);
            });
        });
        LoadingMsg.edit(`${bot.config.emojis.success} | All done! Every Reddit command's cache has been purged.`);
    }
    catch (err) {
        bot.logger(err, "error");
        const ErrorEmbed = new discord_js_1.default.EmbedBuilder()
            .setAuthor({
            name: message.author.tag,
            iconURL: message.author.displayAvatarURL()
        })
            .setTitle("Uh oh!")
            .setDescription(`**An error occured while trying to refresh the Redis cache!**`)
            .addFields([{ name: "**Error**", value: `\`\`\`${err.message}\`\`\``, inline: true }])
            .setColor(discord_js_1.Colors.Red);
        return await message.replyT({
            embeds: [ErrorEmbed]
        });
    }
}
exports.default = new command_1.default(execute, {
    description: `Refreshes the Redis cache of all Reddit commands.`,
    aliases: [],
    dirname: __dirname,
    usage: "",
    ownerOnly: true,
    options: []
});
//# sourceMappingURL=refreshredis.js.map