const RedditCommand = require("../../templates/redditCommand");

module.exports = new RedditCommand({
	description: "I will send a cute animal's picture selected from multible subreddits. Awww!",
	dirname: __dirname,
	aliases: ["cuteanimal"],
	usage: "",
	enabled: true,
	endpoint: "/r/aww/top/.json?sort=top&t=week",
	type: "image",
});
