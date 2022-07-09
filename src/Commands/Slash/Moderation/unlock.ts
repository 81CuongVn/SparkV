import Discord, { Colors, Role } from "discord.js";

import cmd from "../../../Structures/modCommand";

async function execute(bot: any, message: any, args: string[], command: any, data: any) {
	try {
		await message.guild.roles.cache.forEach((role: Role) => message.channel.permissionOverwrites.create(role, { SEND_MESSAGES: true }));

		return await message.replyT({
			embeds: [{
				author: {
					name: message?.user?.tag,
					iconURL: message?.user?.displayAvatarURL()
				},
				description: "**Unlocked**\nThis channel has been unlocked!",
				color: Colors.Green
			}]
		});
	} catch (err: any) {
		message.replyT(`${bot.config.emojis.alert} | Failed to unlock channel. Please make sure I have the correct permissions.`);
	}
}

export default new cmd(execute, {
	description: "I'll unlock the current channel.",
	dirname: __dirname,
	aliases: ["ulock"],
	usage: "",
	perms: ["ManageChannels"],
	bot_perms: ["ManageChannels"],
	slash: true
});
