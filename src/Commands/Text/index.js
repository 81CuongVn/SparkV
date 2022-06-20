const config = require("../../../config.json");
const fs = require("fs");

const commands = fs
	.readdirSync(__dirname)
	.filter(c => c !== "index.ts")
	.map(c => require(`${__dirname}/${c}`));

export default {
	name: "Owner",
	description: "Owner only commands.",
	emoji: config.emojis.owner,
	emojiID: "950869827193548870",
	commands,
};
