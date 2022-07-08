"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __importDefault(require("../.././structures/command"));
async function execute(bot, message, args, command, data) {
    const type = args[0];
    const string = args.join(" ").slice(type.length + 1);
    let decoded;
    if (type === "base64")
        decoded = Buffer.from(string, "base64").toString();
    else if (type === "hex")
        decoded = Buffer.from(string, "hex").toString("utf8");
    else if (type === "url")
        decoded = decodeURIComponent(string);
    if (!decoded)
        return message.replyT(`${bot.config.emojis.error} Uh oh! An error occured while trying to decode the text. Please try again, but with a different string.`);
    await message.replyT(decoded);
}
exports.default = new command_1.default(execute, {
    description: "Decode a string that was once encoded.",
    dirname: __dirname,
    usage: "(text) (type)",
    aliases: [],
    perms: []
});
//# sourceMappingURL=decode.js.map