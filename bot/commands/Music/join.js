const Discord = require("discord.js");

const cmd = require("@templates/musicCommand");

async function execute(bot, message, args, command, data) {
	try {
		bot.distube.voices.join(message.member.voice.channel);

		return await message.replyT(`${bot.config.emojis.music} | Successfully joined voice channel.`);
	} catch (err) {
		return message.replyT(`${bot.config.emojis.error} | I cannot join the voice channel! Please make sure I have the permission to join the voice channel nad that the voice channel is not full.`);
	}
}

module.exports = new cmd(execute, {
	description: "Joins your voice channel.",
	dirname: __dirname,
	usage: "",
	aliases: [],
	perms: [],
	slash: true,
	slashOnly: true
});
