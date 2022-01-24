const RedditCommand = require("../../templates/redditCommand");

module.exports = new RedditCommand({
	description: "Images of cheese. Requested by SmashingBC so I added it. (r/Cheese)",
	dirname: __dirname,
	aliases: ["chez"],
	usage: "",
	enabled: true,
	endpoint: "/r/Cheese/top/.json?sort=top&t=week",
	type: "image",
});
