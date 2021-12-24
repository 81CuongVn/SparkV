const Discord = require(`discord.js`);

const cmd = require("../../templates/command");

async function subtractUserM(UserBalance, value) {
	UserBalance.money.balance -= value;

	await UserBalance.save();
}

async function addUserM(UserBalance, value) {
	UserBalance.money.balance += value;

	await UserBalance.save();
}

async function execute(bot, message, args, command, data) {
	const User = await bot.functions.GetMember(message, args);

	if (!User) return await message.replyT(`${bot.config.emojis.error} | Please say a person to rob.`);

	const UserBalance = await bot.database.getUser(User.id);

	if (data.user.money.balance < 500) return await message.replyT(`${bot.config.emojis.error} | Bruh you cannot rob someone unless you have over ⏣500 coins.`);

	if (UserBalance.money.balance <= 0) return await message.replyT(`${bot.config.emojis.error} | Bruh they have no coins leave them alone you noob!`);

	if (message.author.id === User.id) return await message.replyT(`${bot.config.emojis.error} | Why do you want to rob yourself lol.`);

	if (User.id === bot.config.ownerID) return await message.replyT(`${bot.config.emojis.error} | This user is protected! You can buy a protection shield from being robbed in the shop.`);

	if (UserBalance.money.balance < 0) return await message.replyT(`${bot.config.emojis.error} | This user is in **DEBT**! LOL!! HOW ON EARTH DID THAT HAPPEN LMFAOOOOO!!! Anyways, contact support and we'll reset your balance. :)`);

	const odds = Math.floor(Math.random() * 100) + 1;

	if (odds <= 60) {
		await addUserM(UserBalance, 250);
		await subtractUserM(data.user, 250);

		await message.replyT(`${bot.config.emojis.error} | LOL you got caught! You payed ⏣250 to ${User}.`);
	} else if (odds > 60 && odds <= 80) {
		const Ammount = Math.floor(UserBalance.money.balance * 0.25);

		await addUserM(data.user, Ammount);
		await subtractUserM(UserBalance, Ammount);

		await message.replyT(`${bot.config.emojis.success} | You robbed ${User} and recieved a small payout of ⏣${bot.functions.formatNumber(Ammount)} coins!`);
	} else if (odds > 80 && odds <= 100) {
		const Ammount = Math.floor(UserBalance.money.balance * 0.5);

		await addUserM(data.user, Ammount);
		await subtractUserM(UserBalance, Ammount);

		await message.replyT(`${bot.config.emojis.success} | You robbed ${User} and recieved a large payout of ⏣${bot.functions.formatNumber(Ammount)} coins!`);
	} else {
		const Ammount = Math.round(UserBalance.money.balance);

		await addUserM(data.user, UserBalance.money.balance);
		await subtractUserM(UserBalance, UserBalance.money.balance);

		await message.replyT(`${bot.config.emojis.success} | You robbed ${User} and recieved ALL ⏣${bot.functions.formatNumber(Ammount)} of their coins! Great job!!`);
	}
}

module.exports = new cmd(execute, {
	description: `why u bully me?`,
	dirname: __dirname,
	usage: `<user>`,
	aliases: [],
	perms: ["EMBED_LINKS"],
});
