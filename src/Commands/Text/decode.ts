import Discord from "discord.js";

import cmd from "../.././Structures/command";

async function execute(bot: any, message: any, args: string[], command: any, data: any) {
	const type = args[0];
	const string = args.join(" ").slice(type.length + 1);

	let decoded;
	if (type === "base64") decoded = Buffer.from(string, "base64").toString();
	else if (type === "hex") decoded = Buffer.from(string, "hex").toString("utf8");
	else if (type === "url") decoded = decodeURIComponent(string);

	if (!decoded) return message.replyT(`${bot.config.emojis.error} Uh oh! An error occured while trying to decode the text. Please try again, but with a different string.`);

	await message.replyT(decoded);
}

export default new cmd(execute, {
	description: "Decode a string that was once encoded.",
	dirname: __dirname,
	usage: "(text) (type)",
	aliases: [],
	perms: []
});
