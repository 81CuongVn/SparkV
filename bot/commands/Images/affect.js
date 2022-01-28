const Discord = require("discord.js");

const cmd = require("../../templates/imageCommand");

module.exports = new cmd({
	description: "This won't affect my child at all!",
	dirname: __dirname,
	aliases: [],
	usage: `(user: optional default: you)`,
	effect: "affect",
});
