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
const command_1 = __importDefault(require("../../../Structures/command"));
async function execute(bot, message, args, command, data) {
    const action = data.options.getString("action");
    const amount = data.options.getNumber("money");
    const embed = new discord_js_1.default.EmbedBuilder()
        .setAuthor({
        name: message.user.tag,
        iconURL: message.user.displayAvatarURL()
    })
        .setColor(discord_js_1.Colors.Green)
        .setTimestamp();
    if (action === "deposit") {
        if (data.user.money.balance < amount)
            return await message.editT(`${bot.config.emojis.error} | You don't have that money.`);
        if (data.user.money.bankMax <= amount)
            return await message.editT(`${bot.config.emojis.error} | You don't have enough bank space to hold ⏣${amount}!`);
        data.user.money.balance -= amount;
        data.user.money.bank += amount;
        embed.setDescription(`**${bot.config.emojis.bank} | Money Deposited**\nSuccessfully deposited ⏣${bot.functions.formatNumber(amount)} into your bank.`);
    }
    else if (action === "withdraw") {
        if (data.user.money.bank < amount)
            return await message.editT(`${bot.config.emojis.error} | You don't have that much money in your bank!`);
        data.user.money.balance += amount;
        data.user.money.bank -= amount;
        embed.setDescription(`**${bot.config.emojis.bank} | Money Withdrawed**\nSuccessfully withdrawed ⏣${bot.functions.formatNumber(amount)} into your bank.`);
    }
    data.user.markModified("money.balance");
    data.user.markModified("money.bank");
    await data.user.save();
    await message.editT({
        embeds: [embed]
    });
}
exports.default = new command_1.default(execute, {
    description: "Manage your bank. (Deposit/Withdraw)",
    dirname: __dirname,
    aliases: [],
    usage: "(action) (amount)",
    slash: true,
    ephemeral: true,
    options: [
        {
            type: 3,
            name: "action",
            description: "The action you'd like to take. (Withdraw/deposit)",
            required: true,
            choices: [
                {
                    name: "withdraw",
                    value: "withdraw"
                },
                {
                    name: "deposit",
                    value: "deposit"
                }
            ]
        },
        {
            type: 10,
            name: "money",
            description: "The amount of coins to deposit into your bank!",
            required: true
        }
    ]
});
//# sourceMappingURL=bank.js.map