const RedditCommand = require("@structures/redditCommand");

module.exports = new RedditCommand({
	description: "I will send some mouth-watering food selected from multible subreddits. Yum!",
	dirname: __dirname,
	aliases: [],
	usage: "",
	enabled: true,
	endpoint: "/r/food/top/.json?sort=top&t=week",
	type: "image",
	slash: true,
	options: [
		{
			type: 3,
			name: "type",
			description: "The type of food.",
			choices: [
				{
					name: "cheese",
					value: "/r/Cheese/top/.json?sort=top&t=week"
				},
				{
					name: "taco",
					value: "/r/tacos/top/.json?sort=top&t=week"
				},
				{
					name: "pizza",
					value: "/r/pizza/top/.json?sort=top&t=week"
				}
			]
		}
	]
});
