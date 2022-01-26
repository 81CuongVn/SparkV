const Discord = require(`discord.js`);

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	const User = message?.applicationId ? data.options.getMember("user") : await bot.functions.fetchUser(args[0]);
	const UserData = await bot.database.getUser(User.id);

	if (!User) return await message.replyT("Unable to fetch user. Please try again later.");

	try {
		UserData.money.balance = message?.applicationId ? data.options.getString("coins") : args[1];
		UserData.markModified("money.balance");
		await UserData.save();

		const embed = new Discord.MessageEmbed()
			.setAuthor({
				name: User.user ? User.user.tag : User.tag,
				iconURL: User.displayAvatarURL({ dynamic: true })
			})
			.setTitle(`Successfuly set coins to ⏣${bot.functions.formatNumber(UserData.money.balance)}.`)
			.setColor("GREEN");

		return await message.replyT({
			embeds: [embed]
		});
	} catch (err) {
		console.log(err);

		const ErrorEmbed = new Discord.MessageEmbed()
			.setAuthor({
				name: interaction.user.tag,
				iconURL: interaction.user.displayAvatarURL({ dynamic: true })
			})
			.setTitle("Uh oh!")
			.setDescription(`**An error occured while trying to set ${interaction.user.tag}'s coins!**`)
			.addField("**Error**", `\`\`\`${error.message}\`\`\``)
			.setColor("RED");

		return await message.replyT({
			embeds: [ErrorEmbed]
		});
	}
}

module.exports = new cmd(execute, {
	description: `Set someone's coins!`,
	aliases: [],
	dirname: __dirname,
	usage: `(user) (ammount)`,
	ownerOnly: true,
	slash: true,
	options: [
		{
			type: 6,
			name: "user",
			description: "The user to set the coins of.",
			required: true
		},
		{
			type: 3,
			name: "coins",
			description: "The amount of coins this use should have.",
			required: true
		}
	],
});
