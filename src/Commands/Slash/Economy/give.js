import Discord from "discord.js";

import cmd from "../../../structures/command";

async function execute(bot: any, message: any, args: string[], command: any, data: any) {
	const user = data.options.getUser("user");
	const money = data.options.getNumber("money");

	if (user.id === message.user.id) return await message.editT(`${bot.config.emojis.error} | You can't give money to yourself.`);

	const userData = await bot.database.getUser(user.id);

	if (money === 0) return await message.editT(`${bot.config.emojis.error} | Please supply a valid amount of money to give this person.`);
	if (data.user.money.balance < money) return await message.editT(`${bot.config.emojis.error} | You don't have that much money!`);

	userData.money.balance += parseInt(money);
	data.user.money.balance -= parseInt(money);

	data.user.markModified("money.balance");
	await data.user.save();

	userData.markModified("money.balance");
	await userData.save();

	await message.replyT(`${bot.config.emojis.success} | You gave ${user} ⏣${bot.functions.formatNumber(money)} coins!`);
}

export default new cmd(execute, {
	description: "Give someone some money.",
	dirname: __dirname,
	usage: `(user) (money)`,
	aliases: ["gift"],
	perms: [],
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 6,
			name: "user",
			description: "The user to give money to.",
			required: true
		},
		{
			type: 10,
			name: "money",
			description: "The amount of money to give.",
			required: true
		}
	]
});
