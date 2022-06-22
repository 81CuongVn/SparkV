import Discord from "discord.js";

import cmd from "../../structures/command";

async function execute(bot: any, message: any, args: string[], command: any, data: any) {
	const User = await bot.functions.fetchUser(args[0]);
	const UserData = await bot.database.getUser(User.id);

	if (!User) return await message.replyT("Unable to fetch user. Please try again later.");

	try {
		UserData.money.balance = args[1];
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
	} catch (err: any) {
		bot.logger(err, "error");

		const ErrorEmbed = new Discord.MessageEmbed()
			.setAuthor({
				name: message.author.tag,
				iconURL: message.author.displayAvatarURL({ dynamic: true })
			})
			.setTitle("Uh oh!")
			.setDescription(`**An error occured while trying to set ${message.author.tag}'s coins!**`)
			.addField("**Error**", `\`\`\`${err.message}\`\`\``)
			.setColor("RED");

		return await message.replyT({
			embeds: [ErrorEmbed]
		});
	}
}

export default new cmd(execute, {
	description: `Set someone's coins!`,
	aliases: [],
	dirname: __dirname,
	usage: `(user) (ammount)`,
	ownerOnly: true
});
