const RedditCommand = require("../../templates/redditCommand");

module.exports = new RedditCommand({
	description: "The funny Roblox subredit.",
	dirname: __dirname,
	aliases: ["gcd", "gcommitdie", "gocommitd", "gocdie"],
	usage: "",
	enabled: true,
	endpoint: "/r/gocommitdie/top/.json?sort=top&t=week",
	type: "image",
});
