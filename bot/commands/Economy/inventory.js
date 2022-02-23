const Discord = require("discord.js");
const Easypages = require("discordeasypages");

const cmd = require("../../templates/command");

module.exports = new cmd(
	async (bot, message, args, command, data) => {
		let User = await bot.functions.fetchUser(args[0]);
		let UserData;

		if (User) {
			if (User.bot) return await message.editT("You cannot check the inventory of a bot.");

			UserData = await bot.database.getUser(User.id);
		} else {
			User = message.author;
			UserData = data.user;
		}

		if (UserData.inventory.length === 0) return await message.editT("This user does not have any items in their inventory.");

		const items = Object.keys(UserData.inventory);
		const inventory = items.filter(i => UserData.inventory[i] > 0);

		const pages = [];
		inventory.forEach(item => {
			const itemData = bot.shop.filter(i => i.name === item).first();

			const itemEmbed = new Discord.MessageEmbed()
				.setTitle(`Inventory - ${item}`)
				.setDescription(itemData.description || "This item has no description.")
				.addField("Amount Owned", UserData.inventory[item].toString(), true)
				.addField("Price", `⏣ ${itemData.price}`, true)
				.addField("ID", itemData.ids.join(", "), true)
				.setColor(bot.config.embed.color);

			pages.push(itemEmbed);
		});

		Easypages(message, pages);
	},
	{
		description: "Shows the items you have.",
		dirname: __dirname,
		aliases: ["inv"],
		usage: ""
	},
);
