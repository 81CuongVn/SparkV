import Discord, { Colors } from "discord.js";
import { inspect } from "util";
import fetch from "axios";

import cmd from "../../Structures/command";

async function execute(bot: any, message: any, args: string[], command: any, data: any) {
	let input = args.join(" ");
	if (input.startsWith("```") && input.endsWith("```")) input = input.slice(3, -3);

	let result;
	try {
		result = await eval(input.includes("return") || input.includes("await") ? `(async()=>{${input}})();` : input);
		if (typeof result !== "string") result = inspect(result, { depth: +!(inspect(result, { depth: 1 }).length > 1000) });
	} catch (err: any) { result = err.message; }

	if (input.length + result.length >= 4000) {
		const paste = await fetch.post(`https://hastepaste.com/api/create?raw=false&ext=javascript&text=${encodeURIComponent(`${input}\n\n${result}`)}`).catch(async err => await message.replyT(err.message));

		return await message.replyT(`Eval exceeds 4000 characters. Please view here: ${paste.body}`);
	} else {
		return await message.replyT({
			embeds: [{
				title: `${bot.config.emojis.success} | Eval Results`,
				color: Colors.Green,
				timestamp: new Date(),
				fields: [{
					name: `Input`,
					value: `\`\`\`js\n${input.slice(0, 1000)}\`\`\``
				}, {
					name: `Output`,
					value: `\`\`\`js\n${result.slice(0, 1000)}\`\`\``
				}]
			}]
		});
	}
}

export default new cmd(execute, {
	description: `This is an owner only command.`,
	dirname: __dirname,
	aliases: [],
	usage: `(user)`,
	ownerOnly: true
});
