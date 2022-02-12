const Discord = require("discord.js");

const cmd = require("../../templates/command");

const YesReplies = [
	"Mr. Beast felt bad for you.",
	"An old man gave you some money out of pity.",
];

const NoReplies = [
	"The Rock said to get a job.",
	"Some guy called you a loser."
];

async function execute(bot, message, args, command, data) {
	const choice = Math.floor(Math.random() * 2);
	const Embed = new Discord.MessageEmbed()
		.setAuthor({
			name: message.user.tag,
			iconURL: message.user.displayAvatarURL({ dynamic: true })
		})
		.addField("Want More?", "Get an extra ⏣25,000 by voting for SparkV [here](https://top.gg/bot/884525761694933073/vote)!", true);

	if (choice === 1) {
		const RandomAmmount = (Math.floor(Math.random() * 500) + 1) * data.user.money.multiplier;
		const ReplyText = Math.floor(Math.random() * YesReplies.length);

		data.user.money.balance += RandomAmmount;

		Embed
			.setTitle(`**${YesReplies[ReplyText]}**`)
			.setDescription(`From begging, you received **⏣${await bot.functions.formatNumber(RandomAmmount)}**. You now have ⏣${await bot.functions.formatNumber(data.user.money.balance)} coins!`)
			.setColor("GREEN");
	} else {
		const ReplyText = Math.floor(Math.random() * YesReplies.length);

		Embed
			.setTitle(`**${NoReplies[ReplyText]}**`)
			.setDescription(`No money for you. You're balance stays the same at **⏣${await bot.functions.formatNumber(data.user.money.balance)}** coins.`)
			.setColor("RED");
	}

	data.user.markModified("money.balance");
	await data.user.save();

	await message.replyT({
		embeds: [Embed],
	});
}

module.exports = new cmd(execute, {
	description: "Beg for coins.",
	dirname: __dirname,
	usage: "",
	aliases: [],
	perms: ["EMBED_LINKS"],
	slash: true
});
