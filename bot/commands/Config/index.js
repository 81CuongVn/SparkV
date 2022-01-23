const fs = require("fs");

const commands = fs
	.readdirSync(__dirname)
	.filter(c => c !== "index.js")
	.map(c => require(`${__dirname}/${c}`));

module.exports = {
	name: "Config",
	description: "These commands let you personalize SparkV!",
	emoji: "<:config:934870512235073606>",
	emojiID: "934870512235073606",
	commands,
};
