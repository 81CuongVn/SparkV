const { Permissions } = require("discord.js");

const NewCommand = require("./command");

module.exports = class ModCommand {
	constructor(execute, sett) {
		this.execute = execute;
		this.settings = new NewCommand(execute, Object.assign({ cooldown: 10 * 1000 }, sett)).settings;
	}

	async run(bot, message, args, command, data) {
		if (!message.member.voice.channel) return message.replyT(`${bot.config.emojis.error} | You must be in a __**voice channel**__ to use this command!`);

		const perms = message.channel.permissionsFor(message.guild.me);

		if (
			!perms.has(Permissions.FLAGS.SPEAK) ||
      !perms.has(Permissions.FLAGS.CONNECT) ||
      !perms.has(Permissions.FLAGS.USE_VAD)
		) {
			return await message.replyT("Make sure I have speak, connect and use voice activity perms.");
		}

		if (this.execute) {
			return this.execute(bot, message, args, command, data);
		}
	}
};
