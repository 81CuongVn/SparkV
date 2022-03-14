const RedditCommand = require("../../templates/redditCommand");

module.exports = new RedditCommand({
	description: "Funny internet memes from reddit.",
	dirname: __dirname,
	aliases: [],
	usage: "(subreddit (dankmeme, memeeconomy, prequelmemes, me_irl, gocommitdie, comedycemetery, animalsadvice))",
	enabled: true,
	endpoint: "/r/memes/top/.json?sort=top&t=day",
	type: "image",
	slash: true,
	options: [
		{
			type: 3,
			name: "type",
			description: "The type of meme.",
			choices: [
				{
					name: "dankmeme",
					value: "/r/dankmemes/top/.json?sort=top&t=week"
				},
				{
					name: "memeeconomy",
					value: "https://www.reddit.com/r/MemeEconomy/top/.json?sort=top&t=week"
				},
				{
					name: "prequelmemes",
					value: "/r/PrequelMemes/top/.json?sort=top&t=day"
				},
				{
					name: "me_irl",
					value: "/r/me_irl/top/.json?sort=top&t=day"
				},
				{
					name: "gocommitdie",
					value: "/r/gocommitdie/top/.json?sort=top&t=week"
				},
				{
					name: "comedycemetery",
					value: "/r/ComedyCemetery/top/.json?sort=top&t=week"
				},
				{
					name: "animalsadvice",
					value: "/r/AdviceAnimals/top/.json?sort=top&t=week"
				},
				{
					name: "monke",
					value: "/r/Monke/top/.json?sort=top&t=week"
				}
			]
		}
	],
});
