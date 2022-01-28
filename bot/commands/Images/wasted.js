const Discord = require("discord.js");

const cmd = require("../../templates/imageCommand");

module.exports = new cmd({
	description: "W A S T E D",
	dirname: __dirname,
	aliases: ["waste"],
	usage: `(user: optional default: you)`,
	effect: "wasted",
});
