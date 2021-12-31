const discord = require("discord.js");
const NewCommand = require("./command");

module.exports = class ModCommand {
	constructor(execute, sett) {
		this.execute = execute;
		this.settings = new NewCommand(execute, Object.assign({ cooldown: 2 * 1000 }, sett)).settings;
	}

	async run(bot, message, args, command, data) {
		for (const requiredPerm of this.settings.perms || []) {
			if (!message.channel.permissionsFor(message.member).has(requiredPerm)) {
				return await message.replyT(this.missingPermission("user", requiredPerm));
			} else if (!message.channel.permissionsFor(message.guild.me).has(requiredPerm)) {
				return await message.replyT(this.missingPermission("bot", requiredPerm));
			}
		}

		return this.execute(bot, message, args, command, data);
	}

	missingPermission(type, permission) {
		const permissions = {
			KICK_MEMBERS: "kick members",
			BAN_MEMBERS: "ban members",
			MANAGE_CHANNELS: "manage and edit channels",
			MANAGE_GUILD: "manage and edit server settings",
			MANAGE_MESSAGES: "manage and remove messages",
			MANAGE_NICKNAMES: "edit other people's nicknames",
			MANAGE_ROLES: "manage the roles on this server",
			TIMEOUT_MEMBERS: "timeout members",
		};

		return `Sorry, ${type === "bot" ? "i'm" : "you're"} missing the \`${permission.toUpperCase()}\` permission.\nMake sure ${type === "bot" ? "I have" : "you have"} access to **${permissions[permission]}** and try again.`;
	}
};
