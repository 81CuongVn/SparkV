const Discord = require(`discord.js`);

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	const User = message?.applicationId ? data.options.getMember("user") : await bot.functions.fetchUser(args[0]);
	const UserData = await bot.database.getUser(User.id);

	if (!User) return await message.replyT("Unable to fetch user. Please try again later.");

	UserData.money.balance = message?.applicationId ? data.options.getString("coins") : args[1];
	UserData.markModified("money.balance");
	await UserData.save();

	await message.replyT(`${bot.config.emojis.success} | Success!`);
}

module.exports = new cmd(execute, {
	description: `Set someone's coins!`,
	aliases: [],
	dirname: __dirname,
	usage: `(user) <ammount>`,
	ownerOnly: true,
	slash: true,
	options: [
		{
			type: 6,
			name: "user",
			description: "The user to set the coins of.",
		},
		{
			type: 3,
			name: "coins",
			description: "The amount of coins this use should have."
		}
	]
});
