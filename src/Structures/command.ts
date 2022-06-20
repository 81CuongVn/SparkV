import Discord from "discord.js";

export default class Command {
	constructor(execute, sett) {
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
				perms: ["SEND_MESSAGES"].concat(sett?.perms || []),
				bot_perms: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"].concat(sett?.bot_perms || [])
			}
		);
	}

	async run(bot: any, message: any, args: string[], command: any, data: any) {
		if (message?.channel?.type === "dm") return await message.replyT(`${bot.config.emojis.error} | This command cannot be used in DMs!`);

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

		return this.execute(bot: any, message: any, args: string[], command: any, data: any);
	}
};
