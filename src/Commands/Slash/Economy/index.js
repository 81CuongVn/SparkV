export default {
	name: "Economy",
	description: "Get rich! Use our fun profit commands.",
	emoji: "<:coin:948362336736006144>",
	emojiID: "948362336736006144",
	commands: require("fs")
		.readdirSync(__dirname)
		.filter((c: string) => c !== "index.ts")
		.map((c: string) => require(`${__dirname}/${c}`))
};
