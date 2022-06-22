import Discord from "discord.js";

import cmd from "../../structures/command";

async function execute(bot: any, message: any, args: string[], command: any, data: any) {
	const User = await bot.functions.fetchUser(args[0]);
	if (data.leveling.enabled === "true") {
		const userData = await bot.database.getMember(User.id);

		try {
			userData.xp = args[1];
			userData.level = Math.floor(0.1 * Math.sqrt(parseInt(args[1])));
			await userData.save();

			await message.replyT(`${bot.config.emojis.success} | Successfully set ${User}'s XP to ${bot.functions.formatNumber(args[1])}!`);
		} catch (err: any) {
			bot.logger(err, "error");

			await message.replyT(`${bot.config.emojis.error} | Error setting ${User}'s XP to ${bot.functions.formatNumber(args[1])}.`);
		}
	} else {
		return await message.replyT(`${bot.config.emojis.error} | Leveling is not enabled for this server. Please enable it by doing \`(prefix)Leveling on\`!`);
	}
}

export default new cmd(execute, {
	description: `Set XP.`,
	aliases: [],
	dirname: __dirname,
	usage: `(user) <ammount>`,
	ownerOnly: true
});
