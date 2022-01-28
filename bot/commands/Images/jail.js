const Discord = require("discord.js");

const cmd = require("../../templates/imageCommand");

module.exports = new cmd({
	description: "Show someone's avatar in jail.",
	dirname: __dirname,
	aliases: ["flipcolor"],
	usage: `(user: optional default: you)`,
	effect: "jail",
});
