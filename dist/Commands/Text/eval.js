"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const util_1 = require("util");
const axios_1 = __importDefault(require("axios"));
const command_1 = __importDefault(require("../../structures/command"));
async function execute(bot, message, args, command, data) {
    let input = args.join(" ");
    if (input.startsWith("```") && input.endsWith("```"))
        input = input.slice(3, -3);
    let result;
    try {
        result = await eval(input.includes("return") || input.includes("await") ? `(async()=>{${input}})();` : input);
        if (typeof result !== "string")
            result = (0, util_1.inspect)(result, { depth: +!((0, util_1.inspect)(result, { depth: 1 }).length > 1000) });
    }
    catch (err) {
        result = err.message;
    }
    if (input.length + result.length >= 4000) {
        const paste = await axios_1.default.post(`https://hastepaste.com/api/create?raw=false&ext=javascript&text=${encodeURIComponent(`${input}\n\n${result}`)}`).catch(async (err) => await message.replyT(err.message));
        return await message.replyT(`Eval exceeds 4000 characters. Please view here: ${paste.body}`);
    }
    else {
        return await message.replyT({
            embeds: [{
                    title: `${bot.config.emojis.success} | Eval Results`,
                    color: discord_js_1.Colors.Green,
                    timestamp: new Date(),
                    fields: [{
                            name: `Input`,
                            value: `\`\`\`js\n${input.slice(0, 1000)}\`\`\``
                        }, {
                            name: `Output`,
                            value: `\`\`\`js\n${result.slice(0, 1000)}\`\`\``
                        }]
                }]
        });
    }
}
exports.default = new command_1.default(execute, {
    description: `This is an owner only command.`,
    dirname: __dirname,
    aliases: [],
    usage: `(user)`,
    ownerOnly: true
});
//# sourceMappingURL=eval.js.map