const fs = require("fs");

const commands = fs
	.readdirSync(__dirname)
	.filter(c => c !== "index.js")
	.map(c => require(`${__dirname}/${c}`));

module.exports = {
	name: "Images",
	description: "Make cool images easily!",
	emoji: "<:images:934907893436788827>",
	emojiID: "934907893436788827",
	commands,
};
