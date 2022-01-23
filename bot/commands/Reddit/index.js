const fs = require("fs");

const commands = fs
	.readdirSync(__dirname)
	.filter(c => c !== "index.js")
	.map(c => require(`${__dirname}/${c}`));

module.exports = {
	name: "Reddit",
	description: "Get the latest memes (😂), animal pictures (🐶), and more from Reddit!",
	emoji: "<:reddit:934913808680517772>",
	emojiID: "934913808680517772",
	commands,
};
