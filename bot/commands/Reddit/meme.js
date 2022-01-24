const RedditCommand = require("../../templates/redditCommand");

module.exports = new RedditCommand({
	description: "LOL",
	dirname: __dirname,
	aliases: [],
	usage: "",
	enabled: true,
	endpoint: "/r/memes/top/.json?sort=top&t=day",
	type: "image",
});
