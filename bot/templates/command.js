const Discord = require("discord.js");

module.exports = class Command {
	constructor(execute, sett) {
		this.execute = execute;
		this.settings = Object.assign(
			{
				usage: "{command}",
				cooldown: 2 * 1000,
				ownerOnly: false,
				enabled: true,
			},
			sett,
			{
				perms: ["SEND_MESSAGES"].concat(sett.perms || []),
				bot_perms: ["EMBED_LINKS"].concat(sett.bot_perms || []),
			},
		);
	}

	async run(bot, message, args, command, data) {
		if (this.settings.requireArgs && !args[0]) {
			const embed = new Discord.MessageEmbed()
				.setTitle("Missing Arguments")
				.setDescription(`You need to provide the correct arguments!`)
				.addFields([
					{
						name: "Usage",
						value: `\`${this.settings.usage}\``,
						inline: true
					}
				])
				.setFooter(bot.config.embed.footer)
				.setColor("RED");

			return await message.editT({
				embeds: [embed],
				ephemeral: true,
			});
		}

		const perms = message.channel.permissionsFor(message.user ? message.user : message.author);

		for (const perm of this.settings.perms) {
			if (!perms.has(Discord.Permissions.FLAGS[perm])) {
				const table = {
					content: `${bot.config.emojis.error} | Uh oh! You're missing the \`${perm}\` permission!`,
					ephemeral: true,
				};

				return message?.applicationId ? await message.editT(table) : await message.replyT(table);
			}
		}

		const botperms = message.channel.permissionsFor(message.guild.me);

		for (const perm of this.settings.bot_perms) {
			if (!botperms.has(Discord.Permissions.FLAGS[perm])) {
				const table = {
					content: `${bot.config.emojis.error} | Uh oh! I'm missing the \`${perm}\` permission!`,
					ephemeral: true,
				};

				return message?.applicationId ? await message.editT(table) : await message.replyT(table);
			}
		}

		return this.execute(bot, message, args, command, data);
	}
};
