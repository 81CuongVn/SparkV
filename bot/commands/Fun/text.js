const Discord = require(`discord.js`);
const figlet = require(`figlet`);
const zalgo = require("to-zalgo");

const cmd = require("@templates/command");

const chars = {
	0: ":zero:",
	1: ":one:",
	2: ":two:",
	3: ":three:",
	4: ":four:",
	5: ":five:",
	6: ":six:",
	7: ":seven:",
	8: ":eight:",
	9: ":nine:",
	10: ":ten:",
	"?": ":grey_question:",
	"!": ":grey_exclamation:",
	"#": ":hash:",
	"*": ":asterisk:",
	" ": "   "
};

async function execute(bot, message, args, command, data) {
	const type = data.options.getString("type");
	const text = data.options.getString("text");

	if (!text) return await message.replyT(`${bot.config.emojis.error} | Please supply text.`);
	if (text.length > 100) return await message.replyT(`${bot.config.emojis.error} | Please keep the text under 100 characters.`);

	let editedText;

	if (type === "reverse") {
		editedText = text.split("").reverse().join("");
	} else if (type === "emojify") {
		editedText = text.toLowerCase().split("").map(letter => {
			if (/[a-z]/g.test(letter)) return `:regional_indicator_${letter}: `;
			else if (chars[letter]) return `${chars[letter]} `;

			return letter;
		})
			.join("");
	} else if (type === "asciify") {
		figlet.text(text, async (err, data) => {
			if (err) {
				console.log(`Failed to figlet text: ${err}`);

				return await message.editT(`Uh oh! Something went wrong.`);
			}

			editedText = `\`\`\`${data}\`\`\``;
		});
	} else if (type === "clapify") {
		editedText = text.trim().split(/ +/g).length === 1 ? text.split("").join(" 👏 ") : text.trim().split(/ +/g).join(" 👏 ");
	} else if (type === "zalgo") {
		editedText = zalgo(text);
	} else if (type === "char_count") {
		editedText = `That text has **${text.length} characters**.`;
	}

	await message.replyT(editedText);
}

module.exports = new cmd(execute, {
	description: "I will change the text depending on what you want to do.",
	aliases: [],
	dirname: __dirname,
	usage: "(text)",
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 3,
			name: "text",
			description: "The text to change.",
			required: true
		},
		{
			type: 3,
			name: "type",
			description: "What you want to do to the text. (reverse, emojify, asciify)",
			required: true,
			choices: [
				{
					name: "reverse",
					value: "reverse"
				},
				{
					name: "emojify",
					value: "emojify"
				},
				{
					name: "asciify",
					value: "asciify"
				},
				{
					name: "clapify",
					value: "clapify"
				},
				{
					name: "zalgo",
					value: "zalgo"
				},
				{
					name: "char_count",
					value: "char_count"
				}
			]
		}
	]
});
