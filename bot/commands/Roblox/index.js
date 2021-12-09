const config = require("../../../globalconfig.json");
const fs = require("fs");

const commands = fs
	.readdirSync(__dirname)
	.filter(c => c !== "index.js")
	.map(c => require(`${__dirname}/${c}`));

module.exports = {
	name: "Roblox",
	description: "Roblox commands!",
	emoji: config.emojis.roblox,
	commands,
};
