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
		const perms = message.channel.permissionsFor(message.user ? message.user : message.author);

		for (const perm of this.settings.perms) {
			if (!perms.has(Discord.Permissions.FLAGS[perm])) {
				return message?.applicationId ? await message.editT(`${bot.config.emojis.error} | Uh oh! You're missing the \`${perm}\` permission!`) : await message.replyT(`${bot.config.emojis.error} | Uh oh! You're missing the \`${perm}\` permission!`);
			}
		}

		const botperms = message.channel.permissionsFor(message.guild.me);

		for (const perm of this.settings.bot_perms) {
			if (!botperms.has(Discord.Permissions.FLAGS[perm])) {
				return message?.applicationId ? await message.editT(`${bot.config.emojis.error} | Uh oh! I'm missing the \`${perm}\` permission!`) : await message.replyT(`${bot.config.emojis.error} | Uh oh! I'm missing the \`${perm}\` permission!`);
			}
		}

		return this.execute(bot, message, args, command, data);
	}
};
