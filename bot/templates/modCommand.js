const discord = require("discord.js");
const NewCommand = require("./command");

module.exports = class ModCommand {
	constructor(execute, sett) {
		this.execute = execute;
		this.settings = new NewCommand(execute, Object.assign({ cooldown: 2 * 1000 }, sett)).settings;
	}

	async run(bot, message, args, command, data) {
		const perms = message.channel.permissionsFor(message.user ? message.user : message.author);

		for (const perm of this.settings.perms) {
			if (!perms.has(discord.Permissions.FLAGS[perm])) {
				return await message.replyT({
					content: `${bot.config.emojis.error} | Uh oh! You're missing the \`${perm}\` permission!`,
					ephemeral: true,
				});
			}
		}

		const botperms = message.channel.permissionsFor(message.guild.me);

		for (const perm of this.settings.bot_perms) {
			if (!botperms.has(discord.Permissions.FLAGS[perm])) {
				return await message.replyT({
					content: `${bot.config.emojis.error} | Uh oh! I'm missing the \`${perm}\` permission!`,
					ephemeral: true,
				});
			}
		}

		return this.execute(bot, message, args, command, data);
	}
};
