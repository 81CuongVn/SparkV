const RedditCommand = require("../../templates/redditCommand");

module.exports = new RedditCommand({
	description: "A comic to keep you entertained.",
	dirname: __dirname,
	aliases: ["com"],
	usage: "",
	enabled: true,
	endpoint: "/r/comics/top/.json?sort=top&t=week",
	type: "image",
});
