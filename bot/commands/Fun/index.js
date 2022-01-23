const fs = require("fs");

const commands = fs
	.readdirSync(__dirname)
	.filter(c => c !== "index.js")
	.map(c => require(`${__dirname}/${c}`));

module.exports = {
	name: "Fun",
	description: "Haha!",
	emoji: "<:happysmile:934916888721522698>",
	emojiID: "934916888721522698",
	commands,
};
