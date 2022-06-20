const RedditCommand = require("@structures/redditCommand");

export default new RedditCommand({
	description: "See what's going on on the Discord reddit!",
	dirname: __dirname,
	aliases: ["dailycord", "disdaily"],
	usage: "",
	enabled: true,
	endpoint: "/r/discordapp/top/.json?sort=top&t=week",
	type: "image"
});
