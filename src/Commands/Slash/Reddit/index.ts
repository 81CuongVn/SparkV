export default {
	name: "Reddit",
	description: "Get the latest memes (😂), animal pictures (🐶), and more from Reddit!",
	emoji: "<:reddit:954115515180261406>",
	emojiID: "954115515180261406",
	commands: require("fs").readdirSync(__dirname).filter((c: string) => c !== "index.js" && c.endsWith(".js")).map((c: string) => require(`${__dirname}/${c}`))
};
