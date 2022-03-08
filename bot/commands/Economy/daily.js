const Discord = require("discord.js");

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	if (43200000 - (Date.now() - data.user.cooldowns.daily) > 0) {
		const Embed = new Discord.MessageEmbed()
			.setAuthor({
				name: (message.user ? message.user : message.author).tag,
				iconURL: (message.user ? message.user : message.author).displayAvatarURL({ dynamic: true })
			})
			.setTitle("Daily Reward")
			.setDescription(`You've already claimed your daily reward today.\nCheck back <t:${~~((data.user.cooldowns.daily / 1000) + 43200)}:R> at <t:${~~((data.user.cooldowns.daily / 1000) + 43200)}:t>.`)
			.addField("Want More?", "Get an extra ⏣25,000 by voting [here](https://top.gg/bot/884525761694933073/vote)!", true)
			.setColor("RED")
			.setTimestamp();

		return await message.editT({
			embeds: [Embed],
		});
	}

	data.user.money.balance = (parseInt(data.user.money.balance) + 15000) * data.user.money.multiplier;
	data.user.cooldowns.daily = Date.now();

	data.user.markModified("money.balance");
	data.user.markModified("cooldowns.daily");

	await data.user.save();

	const Embed = new Discord.MessageEmbed()
		.setAuthor({
			name: (message.user ? message.user : message.author).tag,
			iconURL: (message.user ? message.user : message.author).displayAvatarURL({ dynamic: true })
		})
		.setTitle("Daily Reward")
		.setDescription(`You obtained your daily reward of ⏣15,000 coins!${data.user.money.multiplier > 1 ? ` Wow, it also seems you also have a **${data.user.money.multiplier}x** coin multiplier!` : ""}\nYou now have ⏣${await bot.functions.formatNumber(data.user.money.balance)} coins.`)
		.addField("Want More?", "Get an extra ⏣25,000 by voting [here](https://top.gg/bot/884525761694933073/vote)!", true)
		.setColor("GREEN")
		.setTimestamp();

	await message.replyT({
		embeds: [Embed]
	});
}

module.exports = new cmd(execute, {
	description: "Collect your daily amount of coins!",
	dirname: __dirname,
	usage: "",
	aliases: [],
	perms: [],
	cooldown: 10,
	slash: true,
});
