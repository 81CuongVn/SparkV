const fs = require("fs");

const commands = fs
	.readdirSync(__dirname)
	.filter(c => c !== "index.js")
	.map(c => require(`${__dirname}/${c}`));

module.exports = {
	name: "Utility",
	description: "Commands mostly used for basic actions, such as getting a server's icon.",
	emoji: "<:tool:948028430979567646>",
	emojiID: "948028430979567646",
	commands,
};
