const Discord = require("discord.js");

const cmd = require("@templates/musicCommand");

async function execute(bot, message, args, command, data) {
	const state = data.options.getString("state");
	const filter = data.options.getString("type");

	const Queue = bot.distube.getQueue(message);

	if (state === "off" && Queue.filter) {
		bot.distube.setFilter(message, Queue.filter);

		return await message.replyT(`${bot.config.emojis.error} | Okay, I turned off the filter.`);
	} else if (Object.keys(bot.distube.filters).includes(filter)) {
		bot.distube.setFilter(message, filter);

		return await message.replyT(`${bot.config.emojis.music} | Okay, I activated the ${filter} filter on the currently playing song.`);
	}
}

module.exports = new cmd(execute, {
	description: "Change what the song sounds like! Requires administrator to prevent abuse.",
	dirname: __dirname,
	usage: "(filter: 3d/bassboost/echo/karaoke/nightcore/vaporwave/off)",
	aliases: ["setfilter"],
	perms: ["ADMINISTRATOR"],
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 3,
			name: "state",
			description: "Whether the filter is on or off.",
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
			description: "The type of filter to use.",
			required: true,
			choices: [
				{
					name: "3d",
					value: "3d"
				},
				{
					name: "echo",
					value: "echo"
				},
				{
					name: "bassboost",
					value: "bassboost"
				},
				{
					name: "vaporwave",
					value: "vaporwave"
				},
				{
					name: "nightcore",
					value: "nightcore"
				},
				{
					name: "karaoke",
					value: "karaoke"
				}
			]
		}
	]
});
