export default {
	name: "Fun",
	description: "Have fun with SparkV! (Games, Music, Image Generation, chatbot, etc.)",
	emoji: "<:game:948029517417578576>",
	emojiID: "948029517417578576",
	commands: require("fs")
		.readdirSync(__dirname)
		.filter(c => c !== "index.ts")
		.map(c => require(`${__dirname}/${c}`))
};
