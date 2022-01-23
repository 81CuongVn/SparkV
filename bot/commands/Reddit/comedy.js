const RedditCommand = require("../../templates/redditCommand");

module.exports = new RedditCommand({
	description: "The place for comedy memes from r/ComedyCemetery!",
	dirname: __dirname,
	aliases: ["comedycemetery", "cc", "r/cc", "comedyc", "cemeteryc"],
	usage: "",
	enabled: true,
	endpoint: "/r/ComedyCemetery/top/.json?sort=top&t=week",
	type: "image",
});
