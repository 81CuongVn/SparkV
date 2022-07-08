import Discord from "discord.js";

import cmd from "../../../Structures/command";

export default new cmd(
	async (bot: any, message: any, args: string[], command: any, data: any) => {
		let itemName = data.options.getString("item").toLowerCase();
		const amount = data.options.getNumber("amount") || 1;

		const items = Object.keys(data.user.inventory);

		if (!bot.shop.some((i: any) => i.ids.includes(itemName) && i.usable) || !items.includes(itemName)) return await message.editT("That's not a valid item to use. Please run the command inventory to see the items you have.");

		itemName = bot.shop.find((i: any) => i.ids.includes(itemName)).name;

		const inventory = items.filter(i => parseInt(data.user.inventory[i]) > 0);

		if (!inventory.includes(itemName)) return await message.editT("You don't have that item in your inventory.");
		if (parseInt(data.user.inventory[itemName]) < amount) return await message.editT("That's more items than you have in your inventory.");

		data.user.inventory[itemName] -= parseInt(amount);
		data.user.markModified(`inventory.${itemName}`);
		await data.user.save();

		if (itemName === "banknote") {
			data.user.money.bankMax += 10000 * amount;
			data.user.markModified("money.bankMax");
			await data.user.save();

			return await message.editT(`You turn in a note from SparkV to your local Spark Bank. The bank calls you back and says you gained ${10000 * amount} more bank space.`);
		} else {
			const itemData = bot.shop.filter((i: any) => i.name === itemName || i.ids.includes(itemName)).first();
			return await message.editT(itemData.usedMessage || "You used this item.");
		}
	},
	{
		description: "Use an item in your inventory.",
		dirname: __dirname,
		aliases: [],
		usage: "(item) (optional: quantity)",
		slash: true,
		ephemeral: true,
		options: [{
			type: 3,
			name: "item",
			description: "The item to use. To find items to use, open the shop (/shop).",
			required: true
		}, {
			type: 10,
			name: "amount",
			description: "How many times you want to use the item."
		}]
	},
);
