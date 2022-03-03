const fs = require("fs");

const commands = fs
	.readdirSync(__dirname)
	.filter(c => c !== "index.js")
	.map(c => require(`${__dirname}/${c}`));

module.exports = {
	name: "Images",
	description: "Make cool images easily!",
	emoji: "<:image:948004558884442142>",
	emojiID: "948004558884442142",
	commands,
};
