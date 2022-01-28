const Discord = require("discord.js");

const cmd = require("../../templates/imageCommand");

module.exports = new cmd({
	description: "wow you mad bro",
	dirname: __dirname,
	aliases: ["mad"],
	usage: `(user: optional default: you)`,
	effect: "trigger",
});
