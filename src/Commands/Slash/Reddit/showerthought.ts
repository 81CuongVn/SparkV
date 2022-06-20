import RedditCommand from "../../.././structures/redditCommand";

export default new RedditCommand({
	description: "You know that momment where you think/realize something crazy in the shower? Well, there is a whole subreddit full of them...",
	dirname: __dirname,
	aliases: ["shower", "thought"],
	usage: "",
	enabled: true,
	endpoint: "/r/showerthoughts/top/.json?sort=top&t=week",
	type: "text"
});
