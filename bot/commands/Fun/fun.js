const Discord = require("discord.js");
const axios = require("axios");

const cmd = require("@templates/command");

async function execute(bot, message, args, command, data) {
	const type = data.options.getString("type");
	const embed = new Discord.MessageEmbed()
		.setAuthor({
			name: message.user.tag,
			iconURL: message.user.displayAvatarURL({ dynamic: true })
		})
		.setColor("GREEN")
		.setTimestamp();

	if (type === "8ball") {
		const replies = [
			"It is certain",
			"It is decidedly so",
			"Without a doubt",
			"Yes, definitely",
			"You may rely on it",
			"As I see it, yes",
			"Most likely",
			"Outlook good",
			"Yes",
			"Signs pointing to yes",
			"Ask again later",
			"Better not tell you now",
			"Cannot predict now",
			"Concentrate and ask again",
			"Don't count on it",
			"My reply is no",
			"My sources say no",
			"Outlook not so good",
			"very doubtful",
		];

		const goodReplies = [
			"It is certain",
			"It is decidedly so",
			"Without a doubt",
			"Yes, definitely",
			"You may rely on it",
			"As I see it, yes",
			"Most likely",
			"Outlook good",
			"Yes",
			"Signs pointing to yes"
		];

		const reply = replies[Math.floor(Math.random() * replies.length + 0)];

		embed.setDescription(`**8Ball**\n${reply}`).setColor(goodReplies.find(r => r === reply) ? "GREEN" : "RED");
	} else if (type === "advice") {
		const data = await axios.get("https://api.adviceslip.com/advice").then(res => res.data).catch(err => bot.logger(`Advice failed: ${err}`, "error"));

		embed
			.setDescription(`**Here's an advice.**\n${data.slip.advice}`)
			.setFooter({
				text: `You got advice #${data.slip.id}`,
				iconURL: bot.user.displayAvatarURL({ dynamic: true })
			});
	} else if (type === "uselessfact") {
		const data = await axios.get("https://uselessfacts.jsph.pl/random.json?language=en").then(res => res.data).catch(err => bot.logger(`Useless fact failed: ${err}`, "error"));

		embed
			.setDescription(`**${bot.config.emojis.question} | Did you know?**\n${data.text}`)
			.setFooter({
				text: `Fun facts powered by uselessfacts.jsph.pl! • ${bot.config.embed.footer}`,
				iconURL: bot.user.displayAvatarURL({ dynamic: true })
			});
	}

	await message.replyT({
		embeds: [embed]
	});
}

module.exports = new cmd(execute, {
	description: "Just a little fun.",
	dirname: __dirname,
	aliases: [],
	usage: "",
	slash: true,
	options: [
		{
			type: 3,
			name: "type",
			description: "The type of fun you want to have.",
			required: true,
			choices: [
				{
					name: "8ball",
					value: "8ball"
				},
				{
					name: "advice",
					value: "advice"
				},
				{
					name: "uselessfact",
					value: "uselessfact"
				}
			]
		}
	]
});
