const fs = require("fs");

const commands = fs
	.readdirSync(__dirname)
	.filter(c => c !== "index.js")
	.map(c => require(`${__dirname}/${c}`));

module.exports = {
	name: "Chatbot",
	description: "Talk to SparkV!",
	emoji: "<:tada:948365031857356860>",
	emojiID: "948365031857356860",
	commands
};
