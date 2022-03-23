const Discord = require(`discord.js`);

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	const User = data.options.getUser("user") || message.user;

	const UserData = await bot.database.getUser(User.id);

	const BalanceEmbed = new Discord.MessageEmbed()
		.setAuthor({
			name: `${User.tag}'s Balance`,
			iconURL: User.displayAvatarURL({ dynamic: true })
		})
		.addField(`${bot.config.emojis.coin} Wallet`, `⏣${bot.functions.formatNumber(UserData.money.balance)}`, true)
		.addField(`${bot.config.emojis.bank} Bank`, ` ⏣${bot.functions.formatNumber(UserData.money.bank)} / ${bot.functions.formatNumber(UserData.money.bankMax)}`, true)
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
