const Discord = require("discord.js");

const cmd = require("../../templates/imageCommand");

module.exports = new cmd({
	description: "Invert the colors on somebody's avatar.",
	dirname: __dirname,
	aliases: ["flipcolor"],
	usage: `(user: optional default: you)`,
	effect: "invert",
});
