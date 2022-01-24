const fs = require("fs");

const commands = fs
	.readdirSync(__dirname)
	.filter(c => c !== "index.js")
	.map(c => require(`${__dirname}/${c}`));

module.exports = {
	name: "Economy",
	description: "Get rich! Use our fun profit commands.",
	emoji: "<:cash:934874039556669470>",
	emojiID: "934874039556669470",
	commands,
};
