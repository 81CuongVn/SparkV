import Discord, { Colors } from "discord.js";

import cmd from "../../Structures/command";

async function execute(bot: any, message: any, args: string[], command: any, data: any) {
	const User = await bot.functions.fetchUser(args[0]);
	const UserData = await bot.database.getUser(User.id);

	if (!User) return await message.replyT("Unable to fetch user. Please try again later.");

	try {
		UserData.money.balance = args[1];
		UserData.markModified("money.balance");

		await UserData.save();

		const embed = new Discord.EmbedBuilder()
			.setAuthor({
				name: User.user ? User.user.tag : User.tag,
				iconURL: User.displayAvatarURL()
			})
			.setTitle(`Successfuly set coins to ⏣${bot.functions.formatNumber(UserData.money.balance)}.`)
			.setColor(Colors.Green);

		return await message.replyT({
			embeds: [embed]
		});
	} catch (err: any) {
		bot.logger(err, "error");

		const ErrorEmbed = new Discord.EmbedBuilder()
			.setAuthor({
				name: message.author.tag,
				iconURL: message.author.displayAvatarURL()
			})
			.setTitle("Uh oh!")
			.setDescription(`**An error occured while trying to set ${message.author.tag}'s coins!**`)
			.addFields([ { name: "**Error**", value: `\`\`\`${err.message}\`\`\``, inline: true } ])
			.setColor(Colors.Red);

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
