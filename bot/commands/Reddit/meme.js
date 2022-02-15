const RedditCommand = require("../../templates/redditCommand");

module.exports = new RedditCommand({
	description: "Funny internet memes!",
	dirname: __dirname,
	aliases: [],
	usage: "",
	enabled: true,
	endpoint: "/r/memes/top/.json?sort=top&t=day",
	type: "image",
});
