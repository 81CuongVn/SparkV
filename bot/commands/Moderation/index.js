const fs = require("fs");

const commands = fs
	.readdirSync(__dirname)
	.filter(c => c !== "index.js")
	.map(c => require(`${__dirname}/${c}`));

module.exports = {
	name: "Moderation",
	description: "The power to ban, kick, mute and more at your control.",
	emoji: "<:shield_user:934908827340513360>",
	emojiID: "934908827340513360",
	commands,
};
