const Discord = require("discord.js");

const cmd = require("../../templates/gameCommand");

module.exports = new cmd(null, {
	description: "Catch some fish! Requires you to join a VC.",
	dirname: __dirname,
	usage: "",
	aliases: [],
	perms: [],
	gname: "fishing",
	type: "together",
});
