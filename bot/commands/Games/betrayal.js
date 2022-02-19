const Discord = require("discord.js");

const cmd = require("../../templates/gameCommand");

module.exports = new cmd(null, {
	description: "Play a game of betrayal!",
	usage: "",
	dirname: __dirname,
	aliases: [],
	perms: [],
	gname: "betrayal",
	type: "together",
});
