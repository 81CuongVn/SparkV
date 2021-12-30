const Discord = require(`discord.js`);

const SlotItems = [
	"🍎",
	"🥒",
	"💸",
	"💰",
	"💵"
];

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	if (!args) return await message.replyT(`${bot.config.emojis.error} | lol you need to tell me how much to bet.`);

	let win = false;

	if (data.user.money.balance === 0 || data.user.money.balance === null) return await message.replyT(`${bot.config.emojis.error} | You have no money!`);

	if (isNaN(args[0])) return await message.replyT(`${bot.config.emojis.error} | That's not a number!`);

	if (message.content.includes(`-`)) return await message.replyT(`${bot.config.emojis.error} | You cannot bet negitive money lol.`);

	if (args[0] > data.user.money.balance) return await message.replyT(`${bot.config.emojis.error} | You don't have that much lol.`);

	const number = [];

	for (i = 0; i < 3; i++) {
		number[i] = Math.floor(Math.random() * SlotItems.length);
	}

	if (number[0] === number[1] && number[1] === number[2]) {
		args[0] *= 9;
		win = true;
	} else if (number[0] === number[1] || number[0] === number[2] || number[1] === number[2]) {
		args[0] *= 2;
		win = true;
	}

	if (win) {
		await message.replyT(
			`${SlotItems[number[0]]} | ${SlotItems[number[1]]} | ${SlotItems[number[2]]}\n\n${
				bot.config.emojis.success
			} | You won ⏣${bot.functions.formatNumber(parseInt(args[0]) * 2)} coins!`,
		);

		data.user.money.balance += args[0] * 2;
		data.user.markModified("money.balance");
		await data.user.save();
	} else {
		await message.replyT(
			`${SlotItems[number[0]]} | ${SlotItems[number[1]]} | ${SlotItems[number[2]]}\n\n${
				bot.config.emojis.error
			} | You lost ⏣${bot.functions.formatNumber(parseInt(args[0]))} coins.`,
		);

		data.user.money.balance -= parseInt(args[0]);
		data.user.markModified("money.balance");

		await data.user.save();
	}
}

module.exports = new cmd(execute, {
	description: `Don't gamble kids!`,
	dirname: __dirname,
	usage: `<amount>`,
	aliases: ["bet"],
	perms: ["EMBED_LINKS"],
});
