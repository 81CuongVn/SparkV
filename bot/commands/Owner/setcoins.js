const Discord = require(`discord.js`);

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	const User = await bot.functions.GetMember(message, args);

	if (!User) {
		return await message.replyT;
	}

	data.user.money.balance = args[1];
	data.user.markModified("money.balance");
	await data.user.save();

	await message.replyT(`${bot.config.emojis.success} | Success!`);
}

module.exports = new cmd(execute, {
	description: `Set someone's coins!`,
	aliases: [],
	dirname: __dirname,
	usage: `(user) <ammount>`,
	ownerOnly: true
});
