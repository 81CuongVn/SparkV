const Discord = require(`discord.js`);

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	const amount = data.options.getNumber("money").toString();

	if (data.user.money.bank < amount) return await message.replyT(`${bot.config.emojis.error} | You don't have that much data.user.money.balance in your bank!`);

	data.user.money.balance = parseInt(data.user.money.balance) + amount;
	data.user.money.bank = parseInt(data.user.money.balance) - amount;

	data.user.markModified("money.balance");
	data.user.markModified("money.bank");

	await data.user.save();

	await message.replyT(`${bot.config.emojis.success} | Withdrawed ⏣${bot.functions.formatNumber(amount)} from your bank!`);
}

module.exports = new cmd(execute, {
	description: `Withdraw any amount of your bank money into your wallet.`,
	dirname: __dirname,
	aliases: ["with"],
	usage: `(amount)`,
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
