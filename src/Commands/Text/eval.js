import Discord from "discord.js";
const { inspect } = require("util");
const fetch = require("axios");

import cmd from "../../../structures/command";

async function execute(bot: any, message: any, args: string[], command: any, data: any) {
	let input = args.join(" ");

	if (input.startsWith("```") && input.endsWith("```")) input = input.slice(3, -3);

	const hasAsync = input.includes("return") || input.includes("await");
	let result;

	try {
		result = await eval(hasAsync ? `(async()=>{${input}})();` : input);

		if (typeof result !== "string") {
			result = inspect(result, {
				depth: +!(
					inspect(result, {
						depth: 1
					}).length > 1000
				)
			});
		}
	} catch (err) {
		result = err.message;
	}

	if (input.length + result.length >= 4000) {
		const paste = await fetch.post(`https://hastepaste.com/api/create?raw=false&ext=javascript&text=${encodeURIComponent(`${input}\n\n${result}`)}`).catch(async err => await message.replyT(err.message));

		return await message.replyT(`Eval exceeds 4000 characters. Please view here: ${paste.body}`);
	} else {
		const Embed = new Discord.MessageEmbed()
			.setTitle(`${bot.config.emojis.success} | Eval Results`)
			.addField(`Input`, `\`\`\`js\n${input.slice(0, 1000)}\`\`\``)
			.addField(`Output`, `\`\`\`js\n${result.slice(0, 1000)}\`\`\``)
			.setColor(`GREEN`);

		return await message.replyT({
			embeds: [Embed]
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
