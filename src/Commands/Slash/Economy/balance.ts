import Discord from "discord.js";

import cmd from "../../../structures/command";

async function execute(bot: any, message: any, args: string[], command: any, data: any) {
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

export default new cmd(execute, {
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
