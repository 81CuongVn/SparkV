import { ChannelType, PermissionsBitField } from "discord.js";

export default class Command {
	execute: any;
	settings: any;
	constructor(execute: any, sett: any) {
		this.execute = execute;
		this.settings = Object.assign(
			{
				usage: "{command}",
				cooldown: 2 * 1000,
				ownerOnly: false,
				enabled: true
			},
			sett,
			{
				perms: ["SendMessages"].concat(sett?.perms || []),
				bot_perms: ["ViewChannel", "SendMessages", "EmbedLinks"].concat(sett?.bot_perms || [])
			}
		);
	}

	async run(bot: any, message: any, args: string[], command: any, data: any) {
		if (message?.channel?.type === ChannelType.DM) return await message.replyT(`${bot.config.emojis.error} | This command cannot be used in DMs!`);

		const perms = message.channel.permissionsFor(message.user ? message.user : message.author);
		for (const perm of this.settings.perms) {
			if (!perms.has(PermissionsBitField.Flags[perm as keyof typeof PermissionsBitField.Flags])) {
				return message?.applicationId ? await message.editT(`${bot.config.emojis.error} | Uh oh! You're missing the \`${perm}\` permission!`) : await message.replyT(`${bot.config.emojis.error} | Uh oh! You're missing the \`${perm}\` permission!`);
			}
		}

		const botperms = message.channel.permissionsFor(message.guild.members.me);
		for (const perm of this.settings.bot_perms) {
			if (!botperms.has(PermissionsBitField.Flags[perm as keyof typeof PermissionsBitField.Flags])) {
				return message?.applicationId ? await message.editT(`${bot.config.emojis.error} | Uh oh! I'm missing the \`${perm}\` permission!`) : await message.replyT(`${bot.config.emojis.error} | Uh oh! I'm missing the \`${perm}\` permission!`);
			}
		}

		return this.execute(bot, message, args, command, data);
	}
};
