"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Replies = ["heads", "tails"];
const command_1 = __importDefault(require("../../../Structures/command"));
async function execute(bot, message, args, command, data) {
    const Side = data.options.getString("side");
    const Bet = data.options.getNumber("bet").toString();
    const ReplyText = Math.floor(Math.random() * Replies.length);
    const Embed = {
        author: {
            name: message.user.tag,
            icon_url: message.user.displayAvatarURL()
        },
        title: `You flipped ${Replies[ReplyText]}.`,
        field: [{ name: "Want More?", value: "Get an extra ⏣25,000 by voting for SparkV [here](https://top.gg/bot/884525761694933073/vote)!", inline: true }]
    };
    if (Side === Replies[ReplyText]) {
        data.user.money.balance += (Bet * 2);
        Embed.description = `Congrats, you won **⏣${await bot.functions.formatNumber(Bet * 2)}** coins!\nBecause you bet on ${Side}, you now have ⏣${await bot.functions.formatNumber(data.user.money.balance)} coins.`;
        Embed.color = "GREEN";
    }
    else {
        data.user.money.balance -= Bet;
        Embed.description = `Aww, you bet on ${Side} however your coin landed on ${Replies[ReplyText]}. You lost **⏣${await bot.functions.formatNumber(Bet)}** coins.\nYou now have ⏣${await bot.functions.formatNumber(data.user.money.balance)} coins.`;
        Embed.color = "RED";
    }
    data.user.markModified("money.balance");
    await data.user.save();
    await message.replyT({
        embeds: [Embed],
    });
}
exports.default = new command_1.default(execute, {
    description: "Bet on a side and flip a coin! (heads/tails)",
    dirname: __dirname,
    aliases: ["CF"],
    usage: "(Side)",
    slash: true,
    options: [{
            type: 3,
            name: "side",
            description: "The side you bet on.",
            required: true,
            choices: [{
                    name: "heads",
                    value: "heads"
                }, {
                    name: "tails",
                    value: "tails"
                }]
        }, {
            type: 10,
            name: "bet",
            description: "The amount of coins to bet on your selected side!",
            required: true
        }]
});
//# sourceMappingURL=coinflip.js.map