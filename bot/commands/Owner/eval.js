const Discord = require(`discord.js`);
const { inspect } = require("util");
const fetch = require("axios");

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	const input = args.join(" ");
	const hasAsync = input.includes("return") || input.includes("await");
	let result;

	try {
		result = await eval(hasAsync ? `(async()=>{${input}})();` : input);

		if (typeof result !== "string") {
			result = inspect(result, {
				depth: +!(
					inspect(result, {
						depth: 1,
					}).length > 1000
				),
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
			.addField(`Input`, `\`\`\`${input}}\`\`\``)
			.addField(`Output`, `\`\`\`js\n${result}\`\`\``)
			.setColor(`GREEN`);

		return await message.replyT({
			embeds: [Embed],
		});
	}
}

module.exports = new cmd(execute, {
	description: `This is an owner only command.`,
	dirname: __dirname,
	aliases: [],
	usage: `<user>`,
	ownerOnly: true
});
