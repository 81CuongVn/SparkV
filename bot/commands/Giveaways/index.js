const fs = require("fs");

const commands = fs
	.readdirSync(__dirname)
	.filter(c => c !== "index.js")
	.map(c => require(`${__dirname}/${c}`));

module.exports = {
	name: "Giveaways",
	description: "These commands let you create/manage your own giveaways!",
	emoji: "<:tada:948365031857356860>",
	emojiID: "948365031857356860",
	commands,
};
