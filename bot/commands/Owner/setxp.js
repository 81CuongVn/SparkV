const Discord = require(`discord.js`);
const Levels = require(`discord-xp`);

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	const User = await bot.functions.fetchUser(args[0]);
	const Leveling = await bot.database.getGuild(message.guild.id).plugins.leveling.enabled;

	if (!Leveling === true) return await message.replyT(`${bot.config.emojis.error} | Leveling is not enabled for this server. Please enable it by doing \`(prefix)Leveling on\`!`);

	try {
		await Levels.setXp(User.id, message.guild.id, args[1]).then(async () => await message.replyT(`${bot.config.emojis.success} | Successfully set ${User}'s XP to ${bot.functions.formatNumber(args[1])}!`));
	} catch (err) {
		bot.logger(err, "error");

		await message.replyT(`${bot.config.emojis.error} | Error setting ${User}'s XP to ${bot.functions.formatNumber(args[1])}.`);
	}
}

module.exports = new cmd(execute, {
	description: `Set XP.`,
	aliases: [],
	dirname: __dirname,
	usage: `(user) <ammount>`,
	ownerOnly: true
});
