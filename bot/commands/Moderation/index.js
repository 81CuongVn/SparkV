const fs = require("fs");

const commands = fs
	.readdirSync(__dirname)
	.filter(c => c !== "index.js")
	.map(c => require(`${__dirname}/${c}`));

module.exports = {
	name: "Moderation",
	description: "The power to ban, kick, mute and more at your control.",
	emoji: "<:shield_user:943669490024083489>",
	emojiID: "943669490024083489",
	commands,
};
