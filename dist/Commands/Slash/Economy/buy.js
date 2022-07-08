"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __importDefault(require("../../../structures/command"));
exports.default = new command_1.default(async (bot, message, args, command, data) => {
    const itemName = data.options.getString("item").toLowerCase();
    const amount = data.options.getNumber("amount") || 1;
    if (amount === 0 || amount > 100)
        return await message.editT(`${bot.config.emojis.error} | That's not a valid number for the quantity of the item you want to buy.`);
    if (!bot.shop.some((i) => i.ids.includes(itemName)))
        return await message.editT(`${bot.config.emojis.error} | That's not an existing item you can buy in shop!`);
    const item = bot.shop.find((i) => i.ids.includes(itemName));
    if (!item.sale)
        return await message.editT(`${bot.config.emojis.error} | This item is not for sale right now.`);
    if (data.user.money.balance < item.price)
        return await message.editT(`${bot.config.emojis.error} | You don't have enough money to buy this item!`);
    data.user.money.balance -= (item.price - amount);
    data.user.markModified("money.balance");
    if (!data.user.inventory[item.name])
        data.user.inventory[item.name] = 0;
    data.user.inventory[item.name] = parseInt(data.user.inventory[item.name]) + amount;
    data.user.markModified(`inventory.${item.name}`);
    await data.user.save();
    await message.editT(`${bot.config.emojis.success} | Successfully bought ${amount === 1 ? "a" : amount} ${amount > 1 ? `${item.name}s` : item.name} for ⏣${item.price * amount}!`);
}, {
    description: "Buy an item from the shop.",
    dirname: __dirname,
    aliases: [],
    usage: `(item) (optional: quantity)`,
    slash: true,
    ephemeral: true,
    options: [
        {
            type: 3,
            name: "item",
            description: "The item to buy. To find items to buy, open the shop (/shop).",
            required: true
        },
        {
            type: 10,
            name: "amount",
            description: "The quantity of the item you want to buy."
        }
    ]
});
//# sourceMappingURL=buy.js.map