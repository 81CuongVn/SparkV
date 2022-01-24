const fs = require("fs");

const commands = fs
	.readdirSync(__dirname)
	.filter(c => c !== "index.js")
	.map(c => require(`${__dirname}/${c}`));

module.exports = {
	name: "Giveaways",
	description: "These commands let you create/manage your own giveaways!",
	emoji: "<:party:934915498276192297>",
	emojiID: "934915498276192297",
	commands,
};
