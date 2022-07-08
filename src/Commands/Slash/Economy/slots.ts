import Discord, { Colors } from "discord.js";

const SlotItems = ["🍎", "🍏", "🍓", "🍒", "🍑"];

import cmd from "../../../structures/command";

async function execute(bot: any, message: any, args: string[], command: any, data: any) {
	const bet = data.options.getNumber("amount");

	let win = false;

	if (data.user.money.balance === 0 || data.user.money.balance === null) return await message.editT(`${bot.config.emojis.error} | You have no money!`);
	if (bet > data.user.money.balance) return await message.editT(`${bot.config.emojis.error} | You don't have that much lol.`);

	const number = [];
	let amountWon = 0;

	for (let i = 0; i < 3; i++) number[i] = Math.floor(Math.random() * SlotItems.length);

	// All the same in each row
	if (number[0] === number[1] && number[1] === number[2] && number[2] === number[3]) {
		amountWon = bet * 4;
		win = true;
	}

	// Two the same in each row
	if (number[0] === number[1] || number[1] === number[2]) {
		amountWon = bet * 2;
		win = true;
	}

	if (amountWon > 0) win = true;

	let embed: any = {
		author: {
			name: message.user.tag,
			icon_url: message.user.displayAvatarURL()
		},
		description: ``,
		fields: [{
			name: "Slot Machine",
			value: `${SlotItems[number[0]]} | ${SlotItems[number[1]]} | ${SlotItems[number[2]]}`,
			inline: true
		}, {
			name: "Want More?",
			value: "Get an extra ⏣25,000 by voting for SparkV [here](https://top.gg/bot/884525761694933073/vote)!",
			inline: true
		}],
		timestamp: new Date(),
		color: Colors.Red
	}

	if (win) {
		data.user.money.balance += amountWon;
		embed.color = Colors.Green
		embed.description = `Congrats, you won **⏣${await bot.functions.formatNumber(amountWon)}** coins!\nBecause you bet ⏣${await bot.functions.formatNumber(bet)} and won, you now have ⏣${await bot.functions.formatNumber(data.user.money.balance)} coins.`;
	} else {
		data.user.money.balance -= parseInt(bet);
		embed.description = `Aww, you lost **⏣${await bot.functions.formatNumber(bet)}** coins.\nBecause you bet ⏣${await bot.functions.formatNumber(bet)} and lost, you now have ⏣${await bot.functions.formatNumber(data.user.money.balance)} coins.`;
	}

	data.user.markModified("money.balance");
	await data.user.save();

	await message.replyT({ embeds: [embed] });
}

export default new cmd(execute, {
	description: "Gamble your hard-earned money.",
	dirname: __dirname,
	usage: `(amount)`,
	aliases: ["bet"],
	perms: [],
	slash: true,
	options: [{
		type: 10,
		name: "amount",
		description: "The amount of coins to bet.",
		required: true
	}]
});
