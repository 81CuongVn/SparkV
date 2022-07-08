import Discord, { Colors } from "discord.js";

import cmd from "../../Structures/command";

async function execute(bot: any, message: any, args: string[], command: any, data: any) {
	const LoadingMsg = await message.replyT(`Refreshing Redis cache...`);

	try {
		bot.commands
			.filter((command: any) => command.category.toLowerCase() === "reddit")
			.forEach(async (command: any) => {
				await bot.redis.del(command.settings.endpoint, (err: any, response: number) => {
					if (response === 1) message.replyT(`${bot.config.emojis.success} | ${command.name} done.`);
					else message.replyT(`${bot.config.emojis.error} | Uh oh! ${command.name}'s cache failed to be purged. You will have to do this manually.`);
				});
			});

		LoadingMsg.edit(`${bot.config.emojis.success} | All done! Every Reddit command's cache has been purged.`);
	} catch (err: any) {
		bot.logger(err, "error");

		const ErrorEmbed = new Discord.EmbedBuilder()
			.setAuthor({
				name: message.author.tag,
				iconURL: message.author.displayAvatarURL()
			})
			.setTitle("Uh oh!")
			.setDescription(`**An error occured while trying to refresh the Redis cache!**`)
			.addFields([ { name: "**Error**", value: `\`\`\`${err.message}\`\`\``, inline: true } ])
			.setColor(Colors.Red);

		return await message.replyT({
			embeds: [ErrorEmbed]
		});
	}
}

export default new cmd(execute, {
	description: `Refreshes the Redis cache of all Reddit commands.`,
	aliases: [],
	dirname: __dirname,
	usage: "",
	ownerOnly: true,
	options: []
});
