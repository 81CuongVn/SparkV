const Discord = require(`discord.js`);

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	const User = message?.applicationId ? data.options.getMember("user") : (await bot.functions.fetchUser(args[0]));

	if (!User) return await message.replyT(`${bot.config.emojis.error} | Please say a person to rob.`);

	const UserBalance = await bot.database.getUser(User.id);

	if (data.user.money.balance < 500) return await message.replyT(`${bot.config.emojis.error} | Bruh you cannot rob someone unless you have over ⏣500 coins.`);
	if (UserBalance.money.balance <= 0) return await message.replyT(`${bot.config.emojis.error} | Bruh they have no coins leave them alone you noob!`);
	if ((message?.applicationId ? message.user.id : message.author.id) === User.id) return await message.replyT(`${bot.config.emojis.error} | Why do you want to rob yourself lol.`);
	if (User.user.bot) return await message.replyT(`${bot.config.emojis.error} | You cannot rob bots.`);
	if (UserBalance.money.balance < 0) return await message.replyT(`${bot.config.emojis.error} | This user is in **DEBT**! LOL!! HOW ON EARTH DID THAT HAPPEN LMFAOOOOO!!! Anyways, contact support and we'll reset your balance. :)`);

	const odds = Math.floor(Math.random() * 100) + 1;
	const Embed = new Discord.MessageEmbed()
		.setAuthor({
			name: message.user.tag,
			iconURL: message.user.displayAvatarURL({ dynamic: true })
		})
		.addField("Want More?", "Get an extra ⏣25,000 by voting for SparkV [here](https://top.gg/bot/884525761694933073/vote)!", true);

	let amount;
	let type;

	if (odds <= 60) {
		UserBalance.money.balance += 250;
		data.user.money.balance -= 250;

		type = "not-robbed";
	} else if (odds > 60 && odds <= 80) {
		amount = Math.floor(UserBalance.money.balance * 0.25);

		data.user.money.balance += amount;
		UserBalance.money.balance -= amount;

		type = "small-payout";
	} else if (odds > 80 && odds <= 100) {
		amount = Math.floor(UserBalance.money.balance * 0.5);

		data.user.money.balance += amount;
		UserBalance.money.balance -= amount;

		type = "medium-payout";
	} else {
		amount = Math.round(UserBalance.money.balance);

		data.user.money.balance += UserBalance.money.balance;
		UserBalance.money.balance -= UserBalance.money.balance;

		type = "full-payout";
	}

	if (type === "not-robbed") {
		Embed
			.setTitle(`**You got caught!**`)
			.setDescription(`Uh oh! You got caught and paid **⏣250** to ${User}. You now have ⏣${await bot.functions.formatNumber(data.user.money.balance)} coins.`)
			.setColor("RED");
	} else if (type === "small-payout") {
		Embed
			.setTitle(`**Small Payout**`)
			.setDescription(`You got away with a **small amount** of **⏣${await bot.functions.formatNumber(amount)}**. You now have ⏣${await bot.functions.formatNumber(data.user.money.balance)} coins!`)
			.setColor("GREEN");
	} else if (type === "medium-payout") {
		Embed
			.setTitle(`**Large Payout**`)
			.setDescription(`You managed to steal a **large amount** of **⏣${await bot.functions.formatNumber(amount)}**. Great job! You now have ⏣${await bot.functions.formatNumber(data.user.money.balance)} coins!`)
			.setColor("GREEN");
	} else if (type === "full-payout") {
		Embed
			.setTitle(`**FULL PAYOUT!**`)
			.setDescription(`YOU GOT AWAY WITH **ALL ⏣${await bot.functions.formatNumber(amount)}** OF THEIR MONEY LOL. Honestly, they should have protected their coins in their bank. You now have ⏣${await bot.functions.formatNumber(data.user.money.balance)} coins!`)
			.setColor("GREEN");
	}

	await UserBalance.save();
	await data.user.save();

	await message.replyT({
		embeds: [Embed],
	});
}

module.exports = new cmd(execute, {
	description: `Steal somebody's hard earned money.`,
	dirname: __dirname,
	usage: `(user)`,
	aliases: [],
	perms: [],
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 6,
			name: "user",
			description: "The user to rob.",
			required: true
		}
	]
});
