const fs = require("fs");

const commands = fs
	.readdirSync(__dirname)
	.filter(c => c !== "index.js")
	.map(c => require(`${__dirname}/${c}`));

module.exports = {
	name: "Images",
	description: "Make cool images easily!",
	emoji: "<:images:945667300332290128>",
	emojiID: "945667300332290128",
	commands,
};
