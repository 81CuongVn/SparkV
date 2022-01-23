const RedditCommand = require("../../templates/redditCommand");

module.exports = new RedditCommand({
	description: "meirl memes lol.",
	dirname: __dirname,
	aliases: ["me", "irl", "me_irl"],
	usage: "",
	enabled: true,
	endpoint: "/r/me_irl/top/.json?sort=top&t=day",
	type: "image",
});
