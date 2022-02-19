const Discord = require(`discord.js`);

const cmd = require("../../templates/musicCommand");

async function execute(bot, message, args, command, data) {
	const Queue = bot.distube.getQueue(message);
	let mode;

	if (!Queue) return await message.replyT(`${bot.config.emojis.error} | There is no music playing in this guild.`);

	args[0] = args[0].toLowerCase();

	if (args[0] === `song`) mode = 1;
	else if (args[0] === `queue`) mode = 2;
	else if (args[0] === "off") mode = 0;
	else return await message.replyT(`${bot.config.emojis.error} | Invalid argument.`);

	Queue.setRepeatMode(mode);

	await message.replyT(`${bot.config.emojis.music} | Okay, I'll ${args[0] === "off" ? `stop the loop.` : `loop the ${args[0]}.`}`);
}

module.exports = new cmd(execute, {
	description: `Replays the currently playing song.`,
	dirname: __dirname,
	usage: "<song or queue: leave empty to deactivate>",
	aliases: ["replay", "loop"],
	perms: [],
	requireArgs: true,
});
