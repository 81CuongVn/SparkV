const Discord = require("discord.js");

const cmd = require("@templates/command");

const Replies = [
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

module.exports = new cmd(async (bot, message, args, command, data) => await message.replyT(Replies[Math.floor(Math.random() * Replies.length + 0)]), {
	description: "Just a little fun.",
	dirname: __dirname,
	aliases: ["ball"],
	usage: "(question)",
	slash: true,
	options: [
		{
			type: 3,
			name: "question",
			description: "The question to ask 8ball."
		}
	]
});
