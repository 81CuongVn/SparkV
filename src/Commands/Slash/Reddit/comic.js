const RedditCommand = require("@structures/redditCommand");

export default new RedditCommand({
	description: "A comic to keep you entertained.",
	dirname: __dirname,
	aliases: ["com"],
	usage: "",
	enabled: true,
	endpoint: "/r/comics/top/.json?sort=top&t=week",
	type: "image"
});
