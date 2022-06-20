import RedditCommand from "../../.././structures/redditCommand";

export default new RedditCommand({
	description: "I'll send a dose of the internet.",
	dirname: __dirname,
	aliases: ["doi", "dinternet", "dosei"],
	usage: "",
	enabled: true,
	endpoint: "/top/.json?sort=top&t=week",
	type: "image"
});
