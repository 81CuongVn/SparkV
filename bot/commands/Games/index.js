const fs = require("fs");

const commands = fs
	.readdirSync(__dirname)
	.filter(c => c !== "index.js")
	.map(c => require(`${__dirname}/${c}`));

module.exports = {
	name: "Games",
	description: "Games that will keep you busy!",
	emoji: "<:game:945727380826234910>",
	emojiID: "945727380826234910",
	commands,
};
