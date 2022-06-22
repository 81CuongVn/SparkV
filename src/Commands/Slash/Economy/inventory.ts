import Discord from "discord.js";

import cmd from "../../../structures/command";

export default new cmd(
	async (bot: any, message: any, args: string[], command: any, data: any) => {
		let user: any = data.options.getMember("user");
		let userData: any;

		if (user) {
			if (user.bot) return await message.editT("You cannot check the inventory of a bot.");

			userData = await bot.database.getUser(user.id);
		} else {
			user = message.user;
			userData = data.user;
		}

		if (userData.inventory.length === 0) return await message.editT("This user does not have any items in their inventory.");

		const items = Object.keys(userData.inventory);
		const inventory = items.filter(i => userData.inventory[i] > 0);

		const pages: any[] = [];
		inventory.forEach(item => {
			const itemData = bot.shop.filter((i: any) => i.name === item).first();

			const itemEmbed = new Discord.MessageEmbed()
				.setTitle(`Inventory - ${item}`)
				.setDescription(itemData.description || "This item has no description.")
				.addField("Amount Owned", userData.inventory[item].toString(), true)
				.addField("Price", `⏣ ${itemData.price}`, true)
				.addField("ID", itemData.ids.join(", "), true)
				.setColor(bot.config.embed.color);

			pages.push(itemEmbed);
		});
		if (pages.length < 1) return await message.editT("This user does not have any items in their inventory.");

		const quickLeft = new Discord.MessageButton()
			.setEmoji("⬅️")
			.setCustomId("quickLeft")
			.setStyle("SECONDARY");

		const left = new Discord.MessageButton()
			.setEmoji(bot.config.emojis.arrows.left)
			.setCustomId("left")
			.setStyle("SECONDARY");

		const number = new Discord.MessageButton()
			.setEmoji(bot.config.emojis.channel)
			.setCustomId("number")
			.setStyle("SECONDARY");

		const right = new Discord.MessageButton()
			.setEmoji(bot.config.emojis.arrows.right)
			.setCustomId("right")
			.setStyle("SECONDARY");

		const quickRight = new Discord.MessageButton()
			.setEmoji("➡️")
			.setCustomId("quickRight")
			.setStyle("SECONDARY");

		let PageNumber = 0;
		const msg = await message.replyT({
			embeds: [pages[0]],
			components: [new Discord.MessageActionRow().addComponents(quickLeft, left, number, right, quickRight)],
			fetchReply: true
		});

		const collector = msg.createMessageComponentCollector({ time: 300 * 1000 });
		collector.on("collect", async (interaction: any) => {
			if (!interaction.deferred) interaction.deferUpdate().catch((): any => { });
			if (interaction.customId === "quickLeft") PageNumber = 0;
			else if (interaction.customId === "left") PageNumber > 0 ? --PageNumber : PageNumber = (pages.length - 1);
			else if (interaction.customId === "right") PageNumber + 1 < pages.length ? ++PageNumber : PageNumber = 0;
			else if (interaction.customId === "quickRight") PageNumber = pages.length - 1;

			try {
				interaction.edit({
					embeds: [
						pages[PageNumber].setFooter({
							text: `${bot.config.embed.footer} • Page ${PageNumber + 1}/${pages.length}`
						})
					]
				});
			} catch (err: any) {}
		});

		collector.on("end", async () => {
			try {
				await msg?.edit({
					components: []
				});
			} catch (err: any) {}
		});
	},
	{
		description: "Shows the items you have.",
		dirname: __dirname,
		aliases: ["inv"],
		usage: "(user)",
		slash: true,
		slashOnly: true,
		options: [
			{
				type: 6,
				name: "user",
				description: "The user to show the inventory of."
			}
		]
	}
);
