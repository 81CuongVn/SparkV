const Discord = require("discord.js");

const cmd = require("../../templates/command");

module.exports = new cmd(
	async (bot, message, args, command, data) => {
		const items = Object.keys(data.user.inventory);
		args[0] = args[0].toLowerCase();

		if (!bot.shop.some(i => i.ids.includes(args[0]) && i.usable) || !items.includes(args[0])) return await message.editT("That's not a valid item to use. Please run the command inventory to see the items you have.");

		args[0] = bot.shop.find(i => i.ids.includes(args[0])).name;

		const inventory = items.filter(i => parseInt(data.user.inventory[i]) > 0);

		if (!inventory.includes(args[0])) return await message.editT("You don't have that item in your inventory.");

		if (!args[1]) args[1] = 1;

		if (parseInt(data.user.inventory[args[0]]) < parseInt(args[1])) return await message.editT("That's more items than you have in your inventory.");

		data.user.inventory[args[0]] -= parseInt(args[1]);
		data.user.markModified(`inventory.${args[0]}`);

		await data.user.save();

		if (args[0] === "banknote") {
			data.user.money.bankMax += 10000 * args[1];
			data.user.markModified("money.bankMax");
			await data.user.save();

			return await message.editT(`You turn in a note from SparkV to your local Spark Bank. The bank calls you back and says you gained ${10000 * args[1]} more bank space.`);
		} else {
			const itemData = bot.shop.filter(i => i.name === args[0] || i.ids.includes(args[0])).first();

			return await message.editT(itemData.usedMessage || "You used this item.");
		}
	},
	{
		description: "Use an item in your inventory.",
		dirname: __dirname,
		aliases: [],
		usage: "",
	},
);
