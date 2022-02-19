const Discord = require("discord.js");

const cmd = require("../../templates/gameCommand");

module.exports = new cmd(null, {
	description: "Play a game of poker! You must be 18+ to play. Requires you to join a vc with a minimum of 2 people.",
	usage: "",
	dirname: __dirname,
	aliases: [],
	perms: [],
	gname: "poker",
	type: "together",
});
