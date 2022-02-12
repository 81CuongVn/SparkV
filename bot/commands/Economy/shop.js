const Discord = require(`discord.js`);
const easypages = require("discordeasypages");

const cmd = require("../../templates/command");

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

	easypages(message, pages, "shop_menu");
}

module.exports = new cmd(execute, {
	description: `Displays the shop!`,
	dirname: __dirname,
	usage: "",
	aliases: [],
	perms: ["EMBED_LINKS"],
	slash: true
});
