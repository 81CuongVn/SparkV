const Discord = require("discord.js");

const cmd = require("../../templates/imageCommand");

module.exports = new cmd({
	description: "OH NO! HE'S STUPID!",
	dirname: __dirname,
	aliases: ["studpid"],
	usage: `(text)`,
	effect: "ohno",
	useText: true
});
