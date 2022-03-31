const Discord = require(`discord.js`);

const cmd = require("@templates/musicCommand");

async function execute(bot, message, args, command, data) {
	const Queue = bot.distube.getQueue(message);

	if (!Queue) return await message.replyT(`${bot.config.emojis.error} | There is no music playing in this guild.`);

	const state = data.options.getString("state");
	const type = data.options.getString("type");
	let mode;

	if (state === "on") {
		if (type === `song`) mode = 1;
		else if (type === `queue`) mode = 2;
	} else if (state === "off") {
		mode = 0;
	}

	Queue.setRepeatMode(mode);

	await message.replyT(`${bot.config.emojis.music} | Okay, I ${state === "off" ? `stopped the loop.` : `looped the ${type}.`}`);
}

module.exports = new cmd(execute, {
	description: `Replays the currently playing song.`,
	dirname: __dirname,
	usage: "<song or queue: leave empty to deactivate>",
	aliases: ["replay", "loop"],
	perms: [],
	requireArgs: true,
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 3,
			name: "state",
			description: "Whether to repeat or not.",
			required: true,
			choices: [
				{
					name: "on",
					value: "on"
				},
				{
					name: "off",
					value: "off"
				}
			]
		},
		{
			type: 3,
			name: "type",
			description: "The repeating type. Song will repeat the song. Queue will repeat the queue.",
			required: true,
			choices: [
				{
					name: "song",
					value: "song"
				},
				{
					name: "queue",
					value: "queue"
				}
			]
		}
	]
});
