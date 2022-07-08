"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const SlotItems = ["🍎", "🍏", "🍓", "🍒", "🍑"];
const command_1 = __importDefault(require("../../../Structures/command"));
async function execute(bot, message, args, command, data) {
    const bet = data.options.getNumber("amount");
    let win = false;
    if (data.user.money.balance === 0 || data.user.money.balance === null)
        return await message.editT(`${bot.config.emojis.error} | You have no money!`);
    if (bet > data.user.money.balance)
        return await message.editT(`${bot.config.emojis.error} | You don't have that much lol.`);
    const number = [];
    let amountWon = 0;
    for (let i = 0; i < 3; i++)
        number[i] = Math.floor(Math.random() * SlotItems.length);
    // All the same in each row
    if (number[0] === number[1] && number[1] === number[2] && number[2] === number[3]) {
        amountWon = bet * 4;
        win = true;
    }
    // Two the same in each row
    if (number[0] === number[1] || number[1] === number[2]) {
        amountWon = bet * 2;
        win = true;
    }
    if (amountWon > 0)
        win = true;
    let embed = {
        author: {
            name: message.user.tag,
            icon_url: message.user.displayAvatarURL()
        },
        description: ``,
        fields: [{
                name: "Slot Machine",
                value: `${SlotItems[number[0]]} | ${SlotItems[number[1]]} | ${SlotItems[number[2]]}`,
                inline: true
            }, {
                name: "Want More?",
                value: "Get an extra ⏣25,000 by voting for SparkV [here](https://top.gg/bot/884525761694933073/vote)!",
                inline: true
            }],
        timestamp: new Date(),
        color: discord_js_1.Colors.Red
    };
    if (win) {
        data.user.money.balance += amountWon;
        embed.color = discord_js_1.Colors.Green;
        embed.description = `Congrats, you won **⏣${await bot.functions.formatNumber(amountWon)}** coins!\nBecause you bet ⏣${await bot.functions.formatNumber(bet)} and won, you now have ⏣${await bot.functions.formatNumber(data.user.money.balance)} coins.`;
    }
    else {
        data.user.money.balance -= parseInt(bet);
        embed.description = `Aww, you lost **⏣${await bot.functions.formatNumber(bet)}** coins.\nBecause you bet ⏣${await bot.functions.formatNumber(bet)} and lost, you now have ⏣${await bot.functions.formatNumber(data.user.money.balance)} coins.`;
    }
    data.user.markModified("money.balance");
    await data.user.save();
    await message.replyT({ embeds: [embed] });
}
exports.default = new command_1.default(execute, {
    description: "Gamble your hard-earned money.",
    dirname: __dirname,
    usage: `(amount)`,
    aliases: ["bet"],
    perms: [],
    slash: true,
    options: [{
            type: 10,
            name: "amount",
            description: "The amount of coins to bet.",
            required: true
        }]
});
//# sourceMappingURL=slots.js.map