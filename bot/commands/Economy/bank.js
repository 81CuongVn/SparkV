const Discord = require("discord.js");

const cmd = require("@templates/command");

async function execute(bot, message, args, command, data) {
	const action = data.options.getString("action");
	const amount = data.options.getNumber("money");
	const embed = new Discord.EmbedBuilder()
		.setAuthor({
			name: message.user.tag,
			iconURL: message.user.displayAvatarURL({ dynamic: true })
		})
		.setColor("#57F287")
		.setTimestamp();

	if (action === "deposit") {
		if (data.user.money.balance < amount) return await message.editT(`${bot.config.emojis.error} | You don't have that money.`);
		if (data.user.money.bankMax <= amount) return await message.editT(`${bot.config.emojis.error} | You don't have enough bank space to hold ⏣${amount}!`);

		data.user.money.balance -= amount;
		data.user.money.bank += amount;

		embed.setDescription(`**${bot.config.emojis.bank} | Money Deposited**\nSuccessfully deposited ⏣${bot.functions.formatNumber(amount)} into your bank.`);
	} else if (action === "withdraw") {
		if (data.user.money.bank < amount) return await message.editT(`${bot.config.emojis.error} | You don't have that much money in your bank!`);

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

module.exports = new cmd(execute, {
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
