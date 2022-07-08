import { EmbedBuilder, ButtonBuilder, Colors, ButtonStyle } from "discord.js";

import cmd from "../../../Structures/command";

async function execute(bot: any, message: any, args: string[], command: any, data: any) {
	switch (data.options.getString("action")) {
		case "beg": {
			const YesReplies = [
				"Mr. Beast felt bad for you.",
				"An old man gave you some money out of pity."
			];

			const NoReplies = ["The Rock said to get a job.", "Some guy called you a loser."];
			const choice = Math.floor(Math.random() * 2);
			const Embed: any = {
				author: {
					name: message.user.tag,
					icon_url: message.user.displayAvatarURL()
				},
				fields: [{ name: "Want More?", value: "Get an extra ⏣25,000 by voting for SparkV [here](https://top.gg/bot/884525761694933073/vote)!", inline: true }]
			}

			if (choice === 1) {
				const RandomAmmount = (Math.floor(Math.random() * 500) + 1) * data.user.money.multiplier;
				data.user.money.balance += RandomAmmount;
				data.user.markModified("money.balance");
				await data.user.save();

				Embed.title = `**${YesReplies[Math.floor(Math.random() * YesReplies.length)]}**`;
				Embed.description = `From begging, you received **⏣${await bot.functions.formatNumber(RandomAmmount)}**. You now have ⏣${await bot.functions.formatNumber(data.user.money.balance)} coins!`;
				Embed.color = Colors.Green;
			} else {
				Embed.title = `**${NoReplies[Math.floor(Math.random() * YesReplies.length)]}**`;
				Embed.description = `No money for you. You're balance stays the same at **⏣${await bot.functions.formatNumber(data.user.money.balance)}** coins.`;
				Embed.color = Colors.Red;
			}

			await message.replyT({ embeds: [Embed] });
		} case "search": {
			const places = ["Tree", "Sofa", "Parking Lot", "Area51", "The Woods", "Lake", "Ocean"];
			const place1 = places[Math.floor(Math.random() * places.length)];
			const place2 = places[Math.floor(Math.random() * places.length)];
			const place3 = places[Math.floor(Math.random() * places.length)];

			const winningPlace = Math.floor(Math.random() * 2);

			const place1B = new ButtonBuilder().setLabel(place1).setCustomId(`1_${place1.toLowerCase()}`).setStyle(ButtonStyle.Secondary);
			const place2B = new ButtonBuilder().setLabel(place2).setCustomId(`2_${place2.toLowerCase()}`).setStyle(ButtonStyle.Secondary);
			const place3B = new ButtonBuilder().setLabel(place3).setCustomId(`3_${place3.toLowerCase()}`).setStyle(ButtonStyle.Secondary);

			const SearchEmbed = new EmbedBuilder()
				.setAuthor({
					name: message.user.tag,
					iconURL: message.user.displayAvatarURL({ extension: "png", dynamic: true })
				})
				.setDescription(`${bot.config.emojis.question} | Where would you like to search for money?`)
				.setFooter({
					text: bot.config.embed.footer,
					iconURL: bot.user.displayAvatarURL({ extension: "png", dynamic: true })
				})
				.setColor(Colors.Blue);

			const SearchMessage = await message.replyT({
				embeds: [SearchEmbed],
				components: [{
					type: 1,
					components: [place1B, place2B, place3B]
				}]
			});

			const collector = SearchMessage.createMessageComponentCollector({
				filter: (interaction: any) => {
					if (!interaction.deferred) interaction.deferUpdate().catch((): any => { });

					return true;
				}, time: 300 * 1000
			});

			collector.on("collect", async (interaction: any) => {
				const placeNum = parseInt(interaction.customId.split("_")[0]) - 1;
				const place = places.find(p => p.toLowerCase() === interaction.customId.split("_")[1]);

				SearchEmbed.addFields([{ name: "Want More?", value: "Get an extra ⏣25,000 by voting for SparkV [here](https://top.gg/bot/884525761694933073/vote)!", inline: true }])
				if (placeNum === winningPlace) {
					const foundMoney = Math.floor(Math.random() * 1000) * data.user.money.multiplier;

					data.user.money.balance += foundMoney;
					data.user.markModified("money.balance");
					await data.user.save();

					SearchEmbed
						.setDescription(`Congrats, you found ⏣${bot.functions.formatNumber(foundMoney)} coins in **${place}**!${data.user.money.multiplier > 1 ? ` It also seems you also have a **${data.user.money.multiplier}x** coin multiplier!` : ""}\nYou now have ⏣${bot.functions.formatNumber(data.user.money.balance)} coins!`)
						.setColor(Colors.Green);
				} else {
					SearchEmbed
						.setDescription(`Dang, you found nothing in **${place}**.\nYour balance stays the same at ⏣${bot.functions.formatNumber(data.user.money.balance)} coins.`)
						.setColor(Colors.Red);

					if (placeNum === 0) place1B.setStyle(ButtonStyle.Danger);
					else if (placeNum === 1) place2B.setStyle(ButtonStyle.Danger);
					else if (placeNum === 2) place3B.setStyle(ButtonStyle.Danger);
				}

				if (winningPlace === 0) place1B.setStyle(ButtonStyle.Success);
				else if (winningPlace === 1) place2B.setStyle(ButtonStyle.Success);
				else if (winningPlace === 2) place3B.setStyle(ButtonStyle.Success);

				await SearchMessage.edit({
					embeds: [SearchEmbed],
					components: [{
						type: 1,
						components: [place1B.setDisabled(true), place2B.setDisabled(true), place3B.setDisabled(true)]
					}]
				});
			});

			collector.on("end", async () => {
				try {
					await SearchMessage?.edit({
						embeds: [SearchEmbed.setTitle(await message.translate("You didn't search anywhere.")).setDescription(await message.translate(`${bot.config.emojis.alert} | You have gone inactive! Please rerun command to use this command again.`)).setColor(Colors.Red)],
						components: []
					});
				} catch (err: any) { }
			});
		}
	}
}

export default new cmd(execute, {
	description: "Work to recieve coins. (beg/search)",
	dirname: __dirname,
	usage: "",
	aliases: [],
	perms: [],
	slash: true,
	options: [
		{
			type: 3,
			name: "action",
			description: "The type of work to do.",
			required: true,
			choices: [
				{
					name: "beg",
					value: "beg"
				},
				{
					name: "search",
					value: "search"
				}
			]
		}
	]
});
