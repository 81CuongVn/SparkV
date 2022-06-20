export default {
	name: "Utility",
	description: "Commands mostly used for basic actions, such as getting a server's icon.",
	emoji: "<:tool:948028430979567646>",
	emojiID: "948028430979567646",
	commands: require("fs")
		.readdirSync(__dirname)
		.filter((c: string) => c !== "index.ts")
		.map((c: string) => require(`${__dirname}/${c}`))
};
