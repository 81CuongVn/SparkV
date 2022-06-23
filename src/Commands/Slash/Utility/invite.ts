import Discord from "discord.js";

import cmd from "../../../structures/command";

export default new cmd(
	async (bot: any, message: any) => {
		await message.replyT({
			embeds: [{
				description: `**${bot.config.emojis.plus} Invites**\nThe following are links for SparkV!`,
				thumbnail: { url: message.user.displayAvatarURL({ dynamic: true, format: "gif" }) },
				fields: [
					{
						name: `${bot.config.emojis.question} | **Support Server**`,
						value: `[Click Here](${bot.config.support.invite})`,
						inline: true
					},
					{
						name: `${bot.config.emojis.plus} | **Bot Invite**`,
						value: `[Click Here](${bot.config.bot_invite})`,
						inline: true
					}
				],
				footer: {
					text: `Invites for SparkV • ${bot.config.embed.footer}`,
					iconURL: bot.user.displayAvatarURL()
				},
				color: bot.config.embed.color
			}]
		});
	},
	{
		description: "Displays links.",
		dirname: __dirname,
		usage: "",
		aliases: ["invite", "support"],
		perms: [],
		slash: true
	}
);
