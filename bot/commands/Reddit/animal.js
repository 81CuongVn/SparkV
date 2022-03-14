const RedditCommand = require("../../templates/redditCommand");

module.exports = new RedditCommand({
	description: "I will send a cute animal's picture selected from multible subreddits. Awww!",
	dirname: __dirname,
	aliases: ["cuteanimal"],
	usage: "",
	enabled: true,
	endpoint: "/r/aww/top/.json?sort=top&t=week",
	type: "image",
	slash: true,
	options: [
		{
			type: 3,
			name: "type",
			description: "The type of animal.",
			choices: [
				{
					name: "bunnies",
					value: "/r/bunnies/top/.json?sort=top&t=week"
				},
				{
					name: "dogs",
					value: "https://www.reddit.com/r/dogpictures/top/.json?sort=top&t=week"
				},
				{
					name: "cats",
					value: "/r/catpictures/top/.json?sort=top&t=day"
				},
				{
					name: "ducks",
					value: "/r/Duckpictures/top/.json?sort=top&t=day"
				},
				{
					name: "foxes",
					value: "/r/foxes/top/.json?sort=top&t=week"
				},
				{
					name: "monkeys",
					value: "/r/monkeys/top/.json?sort=top&t=week"
				}
			]
		}
	],
});
