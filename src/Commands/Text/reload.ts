import Discord, { Colors } from "discord.js";

import cmd from "../../Structures/command";

async function execute(bot: any, message: any, args: string[], command: any, data: any) {
	const Command = args[0];

	try {
		if (!bot.commands.has(Command.toLowerCase())) return await message.replyT(`${bot.config.emojis.error} | Command \`${Command}\` does not exist.`);

		const CommandFile = await bot.commands.get(Command.toLowerCase());

		bot.commands.delete(Command);
		bot.commands.set(Command.toLowerCase(), CommandFile);

		const embed = new Discord.EmbedBuilder()
			.setAuthor({
				name: message.author.tag,
				iconURL: message.author.displayAvatarURL()
			})
			.setTitle(`Successfuly reloaded ${Command}.`)
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
			.setDescription(`**An error occured while trying to refresh ${Command}!**`)
			.addFields([ { name: "**Error**", value: `\`\`\`${err.message}\`\`\``, inline: true } ])
			.setColor(Colors.Red);

		return await message.replyT({
			embeds: [ErrorEmbed]
		});
	}
}

export default new cmd(execute, {
	description: `Refresh a command.`,
	aliases: [],
	dirname: __dirname,
	usage: `(command)`,
	ownerOnly: true
});
