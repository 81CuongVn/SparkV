const Discord = require("discord.js");

const cmd = require("../../templates/musicCommand");

async function execute(bot, message, args, command, data) {
	bot.distube.voices.join(message.member.voice.channel);

	return await message.replyT("Successfully joined voice channel.");
}

module.exports = new cmd(execute, {
	description:
    "Joins your voice channel.",
	dirname: __dirname,
	usage: "",
	aliases: [],
	perms: [],
	slash: true
});
