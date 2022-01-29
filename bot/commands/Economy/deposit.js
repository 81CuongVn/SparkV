const Discord = require(`discord.js`);

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	const amount = data.options.getNumber("money");

	if (data.user.money.balance < amount) return await message.replyT(`${bot.config.emojis.error} | You don't have that money.`);
	if (data.user.money.bankMax < amount) return await message.replyT(`${bot.config.emojis.error} | You don't have enough bank space to hold ⏣${amount}!`);

	data.user.money.balance -= amount;
	data.user.money.bank += amount;

	data.user.markModified("money.balance");
	data.user.markModified("money.bank");

	await data.user.save();

	await message.replyT(`${bot.config.emojis.success} | Deposited ⏣${bot.functions.formatNumber(amount)} into bank!`);
}

module.exports = new cmd(execute, {
	description: `Deposit your money into your bank.`,
	dirname: __dirname,
	usage: `(amount)`,
	aliases: ["dep"],
	perms: ["EMBED_LINKS"],
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 10,
			name: "money",
			description: "The amount of coins to deposit into your bank!",
			required: true
		}
	]
});
