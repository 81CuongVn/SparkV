const Discord = require("discord.js");

const cmd = require("../../templates/imageCommand");

module.exports = new cmd({
	description: "wow you gae (DISCLAIMER: This is a joke.)",
	dirname: __dirname,
	aliases: [],
	usage: `(user: optional default: you)`,
	effect: "rainbow",
});
