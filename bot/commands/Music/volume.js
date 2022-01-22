const Discord = require(`discord.js`);

const cmd = require("../../templates/musicCommand");

async function execute(bot, message, args, command, data) {
	let volume = message?.applicationId ? data.options.getString("volume") : args[0];
	volume = parseInt(volume);

	const queue = bot.distube.getQueue(message);

	if (!queue) return message.replyT(`${bot.config.emojis.error} | There is nothing in the queue right now!`);
	if (isNaN(volume)) return await message.replyT(`${bot.config.emojis.error} | That's not a valid number!`);
	if (parseInt(volume) > 100) return message.replyT(`${bot.config.emojis.error} | Due to performance reasons, songs cannot go louder than 100%.`);

	queue.setVolume(volume);
	return await message.replyT(`${bot.config.emojis.music} | I successfully set the volume to ${volume}%!`);
}

module.exports = new cmd(execute, {
	description: `Sets the volume of the currently playing track.`,
	dirname: __dirname,
	usage: "",
	aliases: ["setvolume", "vol"],
	perms: ["EMBED_LINKS"],
	slash: true,
	options: [
		{
			type: 3,
			name: "volume",
			description: "A number from 1-100 that controls the song's volume.",
			required: true
		}
	]
});
