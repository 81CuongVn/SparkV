const fs = require("fs");

const commands = fs
	.readdirSync(__dirname)
	.filter(c => c !== "index.js")
	.map(c => require(`${__dirname}/${c}`));

module.exports = {
	name: "Music",
	description: "The ultimate power of music - for free. Rock on!",
	emoji: "<:music:947988551805575189>",
	emojiID: "947988551805575189",
	commands,
};
