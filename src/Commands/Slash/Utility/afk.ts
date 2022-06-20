import Discord, { Message } from "discord.js";

import cmd from "../../../structures/command";

async function execute(bot: any, message: any, args: string[], command: string, data: any) {
	const reason = data.options.getString("reason") || "No reason specified.";

	if (data.user.afk) {
		data.user.afk = null;
		data.user.markModified("afk");
		await data.user.save();

		await message.replyT(bot.config.responses.AFKWelcomeMessage);
	} else {
		data.user.afk = reason;
		data.user.markModified("afk");
		await data.user.save();

		await message.replyT(`You're now AFK. Reason: ${reason}`);
	}
}

export default new cmd(execute, {
	description: `Add/remove your AFK status. If anyone pings you in a server that has SparkV, that person will be notified that you are afk.`,
	dirname: __dirname,
	aliases: [],
	usage: `(optional: reason)`,
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 3,
			name: "reason",
			description: "The reason you are AFK."
		}
	]
});
