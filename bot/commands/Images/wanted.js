const Discord = require("discord.js");

const cmd = require("../../templates/imageCommand");

module.exports = new cmd({
	description: "Create a wanted poster.",
	dirname: __dirname,
	aliases: ["wsign", "wanteds"],
	usage: `(user: optional default: you)`,
	effect: "wanted",
});
