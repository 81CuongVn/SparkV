const discord = require("discord.js");

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
			},
		);
	}

	async run(bot, message, args, command, data) {
		if (this.settings.requireArgs && !args[0]) {
			return await message.replyT(`${bot.config.emojis.error} | Invalid arguments. Please make sure you follow ${this.settings.name} command's usage. Usage: \`${data.guild.prefix}${this.settings.name} ${this.settings.usage}\``);
		}

		return this.execute(bot, message, args, command, data);
	}
};
