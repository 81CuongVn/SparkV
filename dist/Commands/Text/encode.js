"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __importDefault(require("../.././structures/command"));
async function execute(bot, message, args, command, data) {
    const string = args.join(" ").slice(args[0].length + 1);
    let encoded;
    switch (args[0]) {
        case "base64": {
            encoded = Buffer.from(string).toString("base64");
            break;
        }
        case "hex": {
            encoded = (Buffer.from(Buffer.from(string).toString("base64"), "base64")).toString("hex");
            break;
        }
        case "url": {
            encoded = encodeURIComponent(string);
        }
    }
    if (!encoded)
        return message.replyT(`${bot.config.emojis.error} Uh oh! An error occured while trying to encode the text. Please try again, but with a different string.`);
    await message.replyT(encoded);
}
exports.default = new command_1.default(execute, {
    description: "Encode a string.",
    dirname: __dirname,
    usage: "(string) (type)",
    aliases: [],
    perms: []
});
//# sourceMappingURL=encode.js.map