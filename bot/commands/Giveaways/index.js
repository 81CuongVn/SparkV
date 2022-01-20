const fs = require("fs");

const commands = fs
	.readdirSync(__dirname)
	.filter(c => c !== "index.js")
	.map(c => require(`${__dirname}/${c}`));

module.exports = {
	name: "Giveaways",
	description: "These commands let you create/manage your own giveaways!",
	emoji: "<a:tada:819934065414242344>",
	commands,
};
