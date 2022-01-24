const RedditCommand = require("../../templates/redditCommand");

module.exports = new RedditCommand({
	description: "Star Wars memes lol.",
	dirname: __dirname,
	aliases: ["prequelmeme", "pmeme"],
	usage: "",
	enabled: true,
	endpoint: "/r/PrequelMemes/top/.json?sort=top&t=day",
	type: "image",
});
