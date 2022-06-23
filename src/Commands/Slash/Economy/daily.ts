import Discord from "discord.js";

import cmd from "../../../structures/command";

async function execute(bot: any, message: any, args: string[], command: any, data: any) {
	if (43200000 - (Date.now() - data.user.cooldowns.daily) > 0) {
		return await message.editT({
			embeds: [{
				author: {
					name: message.user.tag,
					iconURL: message.user.displayAvatarURL({ dynamic: true })
				},
				title: "Daily Reward",
				description: `You've already claimed your daily reward today.\nCheck back <t:${~~((data.user.cooldowns.daily / 1000) + 43200)}:R> at <t:${~~((data.user.cooldowns.daily / 1000) + 43200)}:t>.`,
				fields: [{
					name: "Want More?",
					value: "Get an extra ⏣25,000 by voting [here](https://top.gg/bot/884525761694933073/vote)!",
					inline: true
				}],
				color: "RED",
				timestamp: new Date()
			}]
		});
	}

	data.user.money.balance = (parseInt(data.user.money.balance) + 15000) * data.user.money.multiplier;
	data.user.cooldowns.daily = Date.now();
	data.user.markModified("money.balance");
	data.user.markModified("cooldowns.daily");
	await data.user.save();

	await message.replyT({
		embeds: [{
			author: {
				name: message.user.tag,
				iconURL: message.user.displayAvatarURL({ dynamic: true })
			},
			title: "Daily Reward",
			description: `You obtained your daily reward of ⏣15,000 coins!${data.user.money.multiplier > 1 ? ` Wow, it also seems you also have a **${data.user.money.multiplier}x** coin multiplier!` : ""}\nYou now have ⏣${await bot.functions.formatNumber(data.user.money.balance)} coins.`,
			fields: [{
				name: "Want More?",
				value: "Get an extra ⏣25,000 by voting [here](https://top.gg/bot/884525761694933073/vote)!",
				inline: true
			}],
			color: "GREEN",
			timestamp: new Date()
		}]
	});
}

export default new cmd(execute, {
	description: "Collect your daily amount of coins!",
	dirname: __dirname,
	usage: "",
	aliases: [],
	perms: [],
	cooldown: 10,
	slash: true,
});
