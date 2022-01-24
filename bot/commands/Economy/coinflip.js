const Discord = require("discord.js");

const Replies = ["heads", "tails"];

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	const Side = data.options.getString("side");
	const Bet = data.options.getNumber("bet").toString();

	const ReplyText = Math.floor(Math.random() * Replies.length);
	const Embed = new Discord.MessageEmbed()
		.setAuthor({
			name: message.user.tag,
			iconURL: message.user.displayAvatarURL({ dynamic: true })
		})
		.setTitle(`You flipped ${Side}.`)
		.addField("Want More?", "Get an extra ⏣25,000 by voting for SparkV [here](https://top.gg/bot/884525761694933073/vote)!", true);

	if (Side === Replies[ReplyText]) {
		data.user.money.balance += (Bet * 2);

		Embed
			.setDescription(`Congrats, you won **⏣${await bot.functions.formatNumber(Bet * 2)}** coins!\nYou now have ⏣${await bot.functions.formatNumber(data.user.money.balance)} coins.`)
			.setColor("GREEN");
	} else {
		data.user.money.balance -= Bet;

		Embed
			.setDescription(`Aww, you lost **⏣${await bot.functions.formatNumber(Bet)}** coins.\nYou now have ⏣${await bot.functions.formatNumber(data.user.money.balance)} coins.`)
			.setColor("RED");
	}

	data.user.markModified("money.balance");
	await data.user.save();

	await message.replyT({
		embeds: [Embed],
	});
}

module.exports = new cmd(execute, {
	description: "Bet on a side and flip a coin! (heads/tails)",
	dirname: __dirname,
	aliases: ["CF"],
	usage: "(Side)",
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 3,
			name: "side",
			description: "The side you bet on.",
			required: true,
			choices: [
				{
					name: "heads",
					value: "heads"
				},
				{
					name: "tails",
					value: "tails"
				}
			]
		},
		{
			type: 10,
			name: "bet",
			description: "The amount of coins to bet on your selected side!",
			required: true
		}
	]
});
