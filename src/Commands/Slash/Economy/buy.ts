import Discord from "discord.js";

import cmd from "../../../structures/command";

export default new cmd(
	async (bot: any, message: any, args: string[], command: any, data: any) => {
		const itemName = data.options.getString("item").toLowerCase();
		const amount = data.options.getNumber("amount") || 1;

		if (amount === 0 || amount > 100) return await message.editT(`${bot.config.emojis.error} | That's not a valid number for the quantity of the item you want to buy.`);

		if (!bot.shop.some((i: any) => i.ids.includes(itemName))) return await message.editT(`${bot.config.emojis.error} | That's not an existing item you can buy in shop!`);

		const item = bot.shop.find((i: any) => i.ids.includes(itemName));

		if (!item.sale) return await message.editT(`${bot.config.emojis.error} | This item is not for sale right now.`);
		if (data.user.money.balance < item.price) return await message.editT(`${bot.config.emojis.error} | You don't have enough money to buy this item!`);

		data.user.money.balance -= (item.price - amount);
		data.user.markModified("money.balance");

		if (!data.user.inventory[item.name]) data.user.inventory[item.name] = 0;

		data.user.inventory[item.name] = parseInt(data.user.inventory[item.name]) + amount;
		data.user.markModified(`inventory.${item.name}`);
		await data.user.save();

		await message.editT(`${bot.config.emojis.success} | Successfully bought ${amount === 1 ? "a" : amount} ${amount > 1 ? `${item.name}s` : item.name} for ⏣${item.price * amount}!`);
	},
	{
		description: "Buy an item from the shop.",
		dirname: __dirname,
		aliases: [],
		usage: `(item) (optional: quantity)`,
		slash: true,
		slashOnly: true,
		ephemeral: true,
		options: [
			{
				type: 3,
				name: "item",
				description: "The item to buy. To find items to buy, open the shop (/shop).",
				required: true
			},
			{
				type: 10,
				name: "amount",
				description: "The quantity of the item you want to buy."
			}
		]
	},
);
