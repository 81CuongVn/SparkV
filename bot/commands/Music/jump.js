const Discord = require(`discord.js`);

const cmd = require("../../templates/musicCommand");

async function execute(bot, message, args, command, data) {
	const number = data.options.getNumber("number");

	const queue = bot.distube.getQueue(message);

	if (!queue) return await message.replyT(`${bot.config.emojis.error} | The queue is empty! Try adding some songs.`);

	bot.distube
		.jump(message, parseInt(number))
		.then(async () => await message.replyT(`${bot.config.emojis.music} | Okay, I successfully jumped to song number ${number} in queue!`))
		.catch(async () => await message.replyT(`${bot.config.emojis.error} | Invalid song number!`).then(m => m.delete({ timeout: 5000 })));
}

module.exports = new cmd(execute, {
	description: `I will jump to a certain song in the queue.`,
	dirname: __dirname,
	usage: "<number>",
	aliases: ["leap"],
	perms: [],
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 10,
			name: "number",
			description: "The song number to skip to. You can check the current song number by using the command /queue.",
			required: true
		}
	]
});
