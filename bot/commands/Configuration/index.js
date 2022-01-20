const fs = require("fs");

const commands = fs
	.readdirSync(__dirname)
	.filter(c => c !== "index.js")
	.map(c => require(`${__dirname}/${c}`));

module.exports = {
	name: "Configuration",
	description: "These commands let you personalize SparkV!",
	emoji: "⚙️",
	commands,
};
