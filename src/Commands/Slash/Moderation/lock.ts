import Discord, { Role, Colors } from "discord.js";

import cmd from "../../../structures/modCommand";

async function execute(bot: any, message: any, args: string[], command: any, data: any) {
	const reason = (message?.applicationId ? data.options.getString("reason") : args.join(" ")) || "No reason provided.";

	try {
		await message.guild.roles.cache.forEach((role: Role) => message.channel.permissionOverwrites.create(role, { SEND_MESSAGES: false }));

		return await message.replyT({
			embeds: [{
				author: {
					name: message.user.tag,
					icon_url: message.user.displayAvatarURL()
				},
				description: `This channel has been locked. Reason: ${reason}`,
				color: Colors.Red,
				timestamp: new Date()
			}]
		});
	} catch (err: any) {
		bot.logger(err, "error");

		message.replyT(`${bot.config.emojis.error} | Failed to lock channel. Please make sure I have the correct permissions.`);
	}
}

export default new cmd(execute, {
	description: "I'll lock the current channel.",
	dirname: __dirname,
	aliases: [],
	usage: "",
	perms: ["ManageChannels"],
	bot_perms: ["ManageChannels"],
	slash: true,
	options: [
		{
			type: 3,
			name: "reason",
			description: "Reason for locking the server.",
		},
	]
});
