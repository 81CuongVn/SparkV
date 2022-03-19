const Discord = require("discord.js");

const cmd = require("../../templates/gameCommand");

module.exports = new cmd(null, {
	description: "Play a guessing game of akinator!",
	usage: "",
	dirname: __dirname,
	aliases: [],
	perms: [],
	gname: "akinator",
	type: "game",
	slash: true,
});
