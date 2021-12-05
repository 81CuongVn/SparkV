const Discord = require(`discord.js`);

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	const User = await bot.functions.GetMember(message, args);

	if (!args) return await message.replyT(`${bot.config.emojis.error} | You need to mention someone to pay and how much.`);
	if (!User) return await message.replyT(`${bot.config.emojis.error} | I cannot find the user.`);
	if (User.id === message.author.id) return await message.replyT(`${bot.config.emojis.error} | You can't give money to yourself lol.`);
	if (isNaN(args[1])) return await message.replyT(`${bot.config.emojis.error} | That's not a number!`);
	if (message.content.includes(`-`)) return await message.replyT(`${bot.config.emojis.error} | You cannot give a user negitive money lol.`);

	const UserMoney = await bot.database.getUser(User.id);

	if (data.user.money.balance < args[1]) return await message.replyT(`${bot.config.emojis.error} | You don't have that much money!`);

	UserMoney.money.balance += parseInt(args[1]);
	data.user.money.balance -= parseInt(args[1]);

	data.user.markModified("money.balance");
	await data.user.save();

	UserMoney.markModified("money.balance");
	await UserMoney.save();

	await message.replyT(
		`${bot.config.emojis.success} | You gave ${User} ⏣${bot.functions.formatNumber(args[1])} coins!`,
	);
}

module.exports = new cmd(execute, {
	description: `Give someone some data.user.money.balance!`,
	dirname: __dirname,
	usage: `<user>`,
	aliases: ["gift"],
	perms: ["EMBED_LINKS"],
});
