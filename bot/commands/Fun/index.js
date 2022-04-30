const fs = require("fs");

const commands = fs
	.readdirSync(__dirname)
	.filter(c => c !== "index.js")
	.map(c => require(`${__dirname}/${c}`));

module.exports = {
	name: "Fun",
	description: "Have fun with SparkV!",
	emoji: "<:game:948029517417578576>",
	emojiID: "948029517417578576",
	commands
};
