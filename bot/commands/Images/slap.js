const Discord = require("discord.js");

const cmd = require("../../templates/imageCommand");

module.exports = new cmd({
	description: "Damn. That's a hard slap!",
	dirname: __dirname,
	aliases: ["attack"],
	usage: `(user: optional default: you) (user: optional default: you)`,
	effect: "slap",
	user2: true,
	useAuthorFirst: true,
});
