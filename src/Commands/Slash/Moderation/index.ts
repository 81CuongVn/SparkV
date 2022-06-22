export default {
	name: "Moderation",
	description: "The power to ban, kick, mute and more at your control.",
	emoji: "<:shield:948028696097337344>",
	emojiID: "948028696097337344",
	commands: require("fs").readdirSync(__dirname).filter((c: string) => c !== "index.js" && c.endsWith(".js")).map((c: string) => require(`${__dirname}/${c}`))
};
