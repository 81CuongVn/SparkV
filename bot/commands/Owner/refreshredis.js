const Discord = require(`discord.js`);

const cmd = require("@templates/command");

async function execute(bot, message, args, command, data) {
	const LoadingMsg = await message.replyT(`Refreshing Redis cache...`);

	try {
		bot.commands
			.filter(command => command.category.toLowerCase() === "reddit")
			.forEach(async command => {
				await bot.redis.del(command.settings.endpoint, (err, response) => {
					if (response === 1) {
						message.replyT(`${bot.config.emojis.success} | ${command.name} done.`);
					} else {
						message.replyT(`${bot.config.emojis.error} | Uh oh! ${command.name}'s cache failed to be purged. You will have to do this manually.`);
					}
				});
			});

		LoadingMsg.edit(`${bot.config.emojis.success} | All done! Every Reddit command's cache has been purged.`);
	} catch (err) {
		bot.logger(err, "error");

		const ErrorEmbed = new Discord.EmbedBuilder()
			.setAuthor({
				name: interaction.author.tag,
				iconURL: interaction.author.displayAvatarURL({ dynamic: true })
			})
			.setTitle("Uh oh!")
			.setDescription(`**An error occured while trying to refresh the Redis cache!**`)
			.addField("**Error**", `\`\`\`${error.message}\`\`\``)
			.setColor("#ED4245");

		return await message.replyT({
			embeds: [ErrorEmbed]
		});
	}
}

module.exports = new cmd(execute, {
	description: `Refreshes the Redis cache of all Reddit commands.`,
	aliases: [],
	dirname: __dirname,
	usage: "",
	ownerOnly: true,
	options: []
});
