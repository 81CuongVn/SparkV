const Discord = require("discord.js");
const moment = require("moment");

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	moment.locale(data.guild.language);

	if (86400000 - (Date.now() - data.user.cooldowns.daily) > 0) return await message.replyT(`Whoa there buddy. I'm not made of money! You've already claimed your daily reward today. Check back <t:${~~((data.user.cooldowns.daily / 1000) + 86400)}:R>.`);

	data.user.money.balance = parseInt(data.user.money.balance) + 15000;
	data.user.cooldowns.daily = Date.now();
	data.user.markModified("money.balance");
	data.user.markModified("cooldowns.daily");
	await data.user.save();

	await message.replyT(
		`${bot.config.emojis.success} | You've just earned ⏣${bot.functions.formatNumber(parseInt(data.user.money.balance) + 15000)}!${data.user.money.multiplier >= 2 ? ` Oh, it seems you also have a **${data.user.money.multiplier}**x coin multiplier! (+⏣${bot.functions.formatNumber(25000 * data.user.money.multiplier)} gained in total).` : ""}`,
	);
}

module.exports = new cmd(execute, {
	description: "Collect your daily amount of coins!",
	dirname: __dirname,
	usage: ``,
	aliases: [],
	perms: ["EMBED_LINKS"],
	cooldown: 10,
});
