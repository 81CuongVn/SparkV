const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { parse } = require("dotenv");

const cmd = require("../../templates/command");

const places = [
	"Tree",
	"Sofa",
	"Parking Lot",
	"Area51"
];

async function execute(bot, message, args, command, data) {
	const place1 = places[Math.floor(Math.random() * places.length)];
	const place2 = places[Math.floor(Math.random() * places.length)];
	const place3 = places[Math.floor(Math.random() * places.length)];

	const winningPlace = Math.floor(Math.random() * 2);

	const place1B = new MessageButton()
		.setLabel(place1)
		.setCustomId(`1_${place1.toLowerCase()}`)
		.setStyle("SECONDARY");

	const place2B = new MessageButton()
		.setLabel(place2)
		.setCustomId(`2_${place2.toLowerCase()}`)
		.setStyle("SECONDARY");

	const place3B = new MessageButton()
		.setLabel(place3)
		.setCustomId(`3_${place3.toLowerCase()}`)
		.setStyle("SECONDARY");

	const SearchEmbed = new MessageEmbed()
		.setAuthor({
			name: (message.user ? message.user : message.author).tag,
			iconURL: (message.user ? message.user : message.author).displayAvatarURL({ format: "png", dynamic: true })
		})
		.setDescription("Where would you like to search for money?")
		.setFooter({
			text: bot.config.embed.footer,
			iconURL: bot.user.displayAvatarURL({ format: "png", dynamic: true })
		})
		.setColor("YELLOW");

	const SearchMessage = await message.replyT({
		embeds: [SearchEmbed],
		components: [new MessageActionRow().addComponents(place1B, place2B, place3B)],
	});

	const collector = SearchMessage.createMessageComponentCollector({
		filter: interaction => {
			if (!interaction.deferred) interaction.deferUpdate();

			return true;
		}, time: 300 * 1000
	});

	collector.on("collect", async interaction => {
		const placeNum = parseInt(interaction.customId.split("_")[0]) - 1;
		const place = places.find(p => p.toLowerCase() === interaction.customId.split("_")[1]);

		SearchEmbed.addField("Want More?", "Get an extra ⏣25,000 by voting for SparkV [here](https://top.gg/bot/884525761694933073/vote)!", true);

		if (placeNum === winningPlace) {
			const foundMoney = Math.floor(Math.random() * 1000) * data.user.money.multiplier;

			data.user.money.balance += foundMoney;

			data.user.markModified("money.balance");
			await data.user.save();

			SearchEmbed
				.setDescription(`Congrats, you found ⏣${bot.functions.formatNumber(foundMoney)} coins in **${place}**!${data.user.money.multiplier > 1 ? ` It also seems you also have a **${data.user.money.multiplier}x** coin multiplier!` : ""}\nYou now have ⏣${bot.functions.formatNumber(data.user.money.balance)} coins!`)
				.setColor("GREEN");
		} else {
			SearchEmbed
				.setDescription(`Dang, you found nothing in **${place}**.\nYour balance stays the same at ⏣${bot.functions.formatNumber(data.user.money.balance)} coins.`)
				.setColor("RED");

			if (placeNum === 0) {
				place1B.setStyle("DANGER");
			} else if (placeNum === 1) {
				place2B.setStyle("DANGER");
			} else if (placeNum === 2) {
				place3B.setStyle("DANGER");
			}
		}

		if (winningPlace === 0) {
			place1B.setStyle("SUCCESS");
		} else if (winningPlace === 1) {
			place2B.setStyle("SUCCESS");
		} else if (winningPlace === 2) {
			place3B.setStyle("SUCCESS");
		}

		await SearchMessage.edit({
			embeds: [SearchEmbed],
			components: [
				new MessageActionRow().addComponents(place1B.setDisabled(true), place2B.setDisabled(true), place3B.setDisabled(true)),
			],
		});
	});

	collector.on("end", async () => {
		try {
			await SearchMessage?.edit({
				embeds: [
					NewEmbed.setTitle(await message.translate("Search - Timed Out!"), bot.user.displayAvatarURL({ dynamic: true })).setDescription(await message.translate("You have gone inactive! Please rerun command to use this command again."))
				],
				components: []
			});
		} catch (err) {
			// Do nothing. This is just to stop errors from going into the console. It's mostly for the case where the message is deleted.
		}
	});
}

module.exports = new cmd(execute, {
	description: "Search a place for coins!",
	dirname: __dirname,
	usage: "",
	aliases: [],
	perms: [],
	slash: true,
	cooldown: 15,
});
