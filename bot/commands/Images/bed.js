const Discord = require("discord.js");

const cmd = require("../../templates/imageCommand");

module.exports = new cmd({
	description: "Why do you hate me, brother?",
	dirname: __dirname,
	aliases: ["underbed"],
	usage: `(user: optional default: you) (user: optional default: you)`,
	effect: "bed",
	user2: true,
	useAuthorFirst: true,
});
