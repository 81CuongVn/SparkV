const config = require("../../../globalconfig.json");
const fs = require("fs");

const commands = fs
	.readdirSync(__dirname)
	.filter(c => c !== "index.js")
	.map(c => require(`${__dirname}/${c}`));

module.exports = {
	name: "Owner",
	description: "Owner only commands.",
	emoji: config.emojis.owner,
	emojiID: "950869827193548870",
	commands,
};
