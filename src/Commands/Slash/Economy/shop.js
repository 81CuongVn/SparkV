const Discord = require(`discord.js`);

const cmd = require("@structures/command");

async function execute(bot, message, args, command, data) {
	const pages = [];

	bot.shop.each(item => {
		const itemEmbed = new Discord.MessageEmbed()
			.setTitle(`Shop - ${item.name}`)
			.setDescription(item.desc || "Well that's odd... this item doesn't have a description.")
			.addField(`IDs`, item.ids.join(", "), true)
			.addField("Price", item.sale ? `⏣ ${item.price}` : `This item isn't for sale.`, true)
			.setColor("BLUE")
			.setTimestamp();

		pages.push(itemEmbed);
	});

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
	collector.on("collect", async interaction => {
		if (!interaction.deferred) interaction.deferUpdate().catch(err => { });
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
		} catch (err) {}
	});

	collector.on("end", async () => {
		try {
			await msg?.edit({
				components: []
			});
		} catch (err) {}
	});
}

module.exports = new cmd(execute, {
	description: `Displays the shop!`,
	dirname: __dirname,
	usage: "",
	aliases: [],
	perms: [],
	slash: true
});
