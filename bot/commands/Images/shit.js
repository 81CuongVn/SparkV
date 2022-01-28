const Discord = require("discord.js");

const cmd = require("../../templates/imageCommand");

module.exports = new cmd({
	description: "Dammit! I stept in shit!!",
	dirname: __dirname,
	aliases: ["crap"],
	usage: `(user: optional default: you)`,
	effect: "shit",
});
