const Discord = require("discord.js");

const cmd = require("../../templates/imageCommand");

module.exports = new cmd({
	description: "The \"Change my mind\" meme.",
	dirname: __dirname,
	aliases: ["cmm"],
	usage: `(text)`,
	effect: "changemymind",
	useText: true
});
