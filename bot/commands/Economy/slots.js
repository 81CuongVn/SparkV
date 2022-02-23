const Discord = require(`discord.js`);

const SlotItems = [
	"🍎",
	"🍏",
	"🍓",
	"🍒",
	"🍑",
];

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	const bet = data.options.getNumber("amount");

	let win = false;

	if (data.user.money.balance === 0 || data.user.money.balance === null) return await message.editT(`${bot.config.emojis.error} | You have no money!`);
	if (bet > data.user.money.balance) return await message.editT(`${bot.config.emojis.error} | You don't have that much lol.`);

	const number = [];
	let amountWon = 0;

	for (i = 0; i < 9; i++) {
		number[i] = Math.floor(Math.random() * SlotItems.length);
	}

	// All the same in each row
	if (number[0] === number[1] && number[1] === number[2] && number[2] === number[3]) {
		amountWon = bet * 4;
		win = true;
	}

	if (number[3] === number[4] && number[4] === number[5] && number[5] === number[6]) {
		amountWon = bet * 4;
		win = true;
	}

	if (number[6] === number[7] && number[7] === number[8] && number[8] === number[9]) {
		amountWon = bet * 4;
		win = true;
	}

	// Two the same in each row
	if (number[0] === number[1] || number[0] === number[2] || number[1] === number[2]) {
		amountWon = bet * 2;
		win = true;
	}

	if (number[0] === number[3] || number[1] === number[4] || number[2] === number[5]) {
		amountWon = bet * 2;
		win = true;
	}

	if (number[3] === number[4] || number[4] === number[5]) {
		amountWon = bet * 2;
		win = true;
	}

	if (number[6] === number[7] || number[7] === number[8]) {
		amountWon = bet * 2;
		win = true;
	}

	if (amountWon > 0) win = true;

	const embed = new Discord.MessageEmbed()
		.setAuthor({
			name: message.user.tag,
			iconURL: message.user.displayAvatarURL({ dynamic: true })
		})
		.addField("Slot Machine", `${SlotItems[number[0]]} | ${SlotItems[number[1]]} | ${SlotItems[number[2]]}\n${SlotItems[number[3]]} | ${SlotItems[number[4]]} | ${SlotItems[number[5]]}\n${SlotItems[number[6]]} | ${SlotItems[number[7]]} | ${SlotItems[number[8]]}`)
		.addField("Want More?", "Get an extra ⏣25,000 by voting for SparkV [here](https://top.gg/bot/884525761694933073/vote)!", true)
		.setFooter({
			text: bot.config.embed.footer,
			iconURL: bot.user.displayAvatarURL({ dynamic: true })
		});

	if (win) {
		data.user.money.balance += amountWon;

		embed
			.setColor("GREEN")
			.setDescription(`Congrats, you won **⏣${await bot.functions.formatNumber(amountWon)}** coins!\nBecause you bet ⏣${await bot.functions.formatNumber(bet)} and won, you now have ⏣${await bot.functions.formatNumber(data.user.money.balance)} coins.`);
	} else {
		data.user.money.balance -= parseInt(bet);

		embed
			.setColor("RED")
			.setDescription(`Aww, you lost **⏣${await bot.functions.formatNumber(bet)}** coins.\nBecause you bet ⏣${await bot.functions.formatNumber(bet)} and lost, you now have ⏣${await bot.functions.formatNumber(data.user.money.balance)} coins.`);
	}

	data.user.markModified("money.balance");
	await data.user.save();

	await message.replyT({
		embeds: [embed],
	});
}

module.exports = new cmd(execute, {
	description: "Don't gamble kids!",
	dirname: __dirname,
	usage: `(amount)`,
	aliases: ["bet"],
	perms: [],
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 10,
			name: "amount",
			description: "The amount of coins to bet.",
			required: true
		}
	]
});
