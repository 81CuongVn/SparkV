import Discord, { Permissions } from "discord.js";
import NewCommand from "./command";

export default class ModCommand {
	execute: any;
	settings: any
	constructor(execute: any, sett: any) {
		this.execute = execute;
		this.settings = new NewCommand(execute, Object.assign({ cooldown: 2 * 1000 }, sett)).settings;
	}

	async run(bot: any, message: any, args: string[], command: any, data: any) {
		const perms = message.channel.permissionsFor(message.user ? message.user : message.author);

		for (const perm of this.settings.perms) {
			if (!perms.has(Permissions.FLAGS[perm as keyof typeof Permissions.FLAGS])) {
				const table = {
					content: `${bot.config.emojis.error} | Uh oh! You're missing the \`${perm}\` permission!`,
					ephemeral: true,
				};

				return message?.applicationId ? await message.editT(table) : await message.replyT(table);
			}
		}

		const botperms = message.channel.permissionsFor(message.guild.me);

		for (const perm of this.settings.bot_perms) {
			if (!botperms.has(Permissions.FLAGS[perm as keyof typeof Permissions.FLAGS])) {
				return await message.replyT({
					content: `${bot.config.emojis.error} | Uh oh! I'm missing the \`${perm}\` permission!`,
					ephemeral: true,
				});
			}
		}

		return this.execute(bot, message, args, command, data);
	}
};
