import Discord from "discord.js";

import cmd from "../.././Structures/command";

async function execute(bot: any, message: any, args: string[], command: any, data: any) {
	const string = args.join(" ").slice(args[0].length + 1);

	let encoded;
	switch (args[0]) {
		case "base64": {
			encoded = Buffer.from(string).toString("base64");
			break;
		} case "hex": {
			encoded = (Buffer.from(Buffer.from(string).toString("base64"), "base64")).toString("hex");
			break;
		} case "url": {
			encoded = encodeURIComponent(string);
		}
	}
	if (!encoded) return message.replyT(`${bot.config.emojis.error} Uh oh! An error occured while trying to encode the text. Please try again, but with a different string.`);

	await message.replyT(encoded);
}

export default new cmd(execute, {
	description: "Encode a string.",
	dirname: __dirname,
	usage: "(string) (type)",
	aliases: [],
	perms: []
});
