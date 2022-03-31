const Discord = require("discord.js");
const canvacord = require("canvacord");

const cmd = require("@templates/command");

module.exports = new cmd(async (bot, message) => await message.replyT(`The current date is <t:${~~(Date.now() / 1000)}:F>.`), {
	description: "Gets the current date.",
	dirname: __dirname,
	aliases: [],
	usage: "",
	slash: true
});
