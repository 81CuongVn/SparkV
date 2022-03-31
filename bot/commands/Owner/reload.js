const Discord = require(`discord.js`);

const cmd = require("@templates/command");

async function execute(bot, message, args, command, data) {
	const Command = args[0];

	try {
		if (!bot.commands.has(Command.toLowerCase())) return await message.replyT(`${bot.config.emojis.error} | Command \`${Command}\` does not exist.`);

		const CommandFile = await bot.commands.get(Command.toLowerCase());

		bot.commands.delete(Command);
		bot.commands.set(Command.toLowerCase(), CommandFile);

		const embed = new Discord.MessageEmbed()
			.setAuthor({
				name: message.author.tag,
				iconURL: message.author.displayAvatarURL({ dynamic: true })
			})
			.setTitle(`Successfuly reloaded ${Command}.`)
			.setColor("GREEN");

		return await message.replyT({
			embeds: [embed]
		});
	} catch (err) {
		bot.logger(err, "error");

		const ErrorEmbed = new Discord.MessageEmbed()
			.setAuthor({
				name: message.author.tag,
				iconURL: message.author.displayAvatarURL({ dynamic: true })
			})
			.setTitle("Uh oh!")
			.setDescription(`**An error occured while trying to refresh ${Command}!**`)
			.addField("**Error**", `\`\`\`${err.message}\`\`\``)
			.setColor("RED");

		return await message.replyT({
			embeds: [ErrorEmbed]
		});
	}
}

module.exports = new cmd(execute, {
	description: `Refresh a command.`,
	aliases: [],
	dirname: __dirname,
	usage: `(command)`,
	ownerOnly: true,
});
