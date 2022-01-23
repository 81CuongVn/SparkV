const RedditCommand = require("../../templates/redditCommand");

module.exports = new RedditCommand({
	description: "lol",
	dirname: __dirname,
	aliases: ["memeeconomy"],
	usage: "",
	enabled: true,
	endpoint: "https://www.reddit.com/r/MemeEconomy/top/.json?sort=top&t=week",
	type: "image",
});
