const fs = require("fs");

const commands = fs
	.readdirSync(__dirname)
	.filter(c => c !== "index.js")
	.map(c => require(`${__dirname}/${c}`));

module.exports = {
	name: "Music",
	description: "The ultimate power of music - for free. Rock on!",
	emoji: "<:music:934889415648608256>",
	emojiID: "934889415648608256",
	commands,
};
