const Discord = require(`discord.js`);

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	const User = message?.applicationId ? data.options.getMember("user") || message.user : (await bot.functions.fetchUser(args[0]) || message.author);

	if (!User) return message.replyT("Please mention a valid user to get the balance of.");

	const UserData = await bot.database.getUser(User.user ? User.user.id : User.id);

	const BalanceEmbed = new Discord.MessageEmbed()
		.setTitle(`**${User.user ? User.user.tag : User.tag}'s Balance**`)
		.setDescription(`
			🪙 Wallet: ⏣${bot.functions.formatNumber(UserData.money.balance)}
			🏦 Bank: ⏣${bot.functions.formatNumber(UserData.money.bank)} / ${bot.functions.formatNumber(UserData.money.bankMax)}
		`)
		.setColor(bot.config.embed.color)
		.setTimestamp();

	await message.replyT({
		embeds: [BalanceEmbed],
	});
}

module.exports = new cmd(execute, {
	description: `View your balance.`,
	dirname: __dirname,
	aliases: ["bal"],
	usage: "(user default: you)",
	slash: true,
	options: [
		{
			type: 6,
			name: "user",
			description: "The user to get the balance of.",
		}
	]
});
