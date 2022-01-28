const Discord = require("discord.js");

const cmd = require("../../templates/imageCommand");

module.exports = new cmd({
	description: `Rest In Peace.`,
	dirname: __dirname,
	aliases: [],
	usage: `(user: optional default: you)`,
	effect: "rip",
});
