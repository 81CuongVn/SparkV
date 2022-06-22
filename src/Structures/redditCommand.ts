import Discord from "discord.js";
import fetch from "axios";

import NewCommand from "./command";

const filters = {
	image: (post: any) => post.data.post_hint === "image",
	text: (post: any) => post.data.post_hint !== "image" && post.data.selftext.length <= 2000 && post.data.title.length <= 256
};

export default class RedditCommand {
	settings: any;
	constructor(sett: any) {
		this.settings = new NewCommand(
			null,
			Object.assign(
				{
					cooldown: 2 * 1000,
					slash: true,
					bot_perms: ["EMBED_LINKS"]
				},
				sett
			)
		).settings;
	}

	async run(bot: any, message: any, args: string[], command: any, data: any) {
		let endpoint = this.settings.endpoint;

		if (data?.options?.getString("type")) endpoint = data?.options?.getString("type");

		let res;
		const cache = await bot.redis.get(endpoint).then((res: any) => JSON.parse(res));

		if (cache) {
			res = cache;
		} else {
			res = await fetch.get(`https://www.reddit.com${endpoint}`)
				.then((res: any) => res.data)
				.catch((): any => {});

			await bot.redis.set(endpoint, JSON.stringify(res), {
				EX: 15 * 60
			});
		}

		if (!res) return;

		const posts = res.data.children.filter(filters[this.settings.type as keyof typeof filters]);
		let selectedPost = posts[Math.floor(Math.random() * Object.keys(posts).length)];
		if (selectedPost) selectedPost = selectedPost.data;
		else return;

		const RedditEmbed = new Discord.MessageEmbed()
			.setTitle(selectedPost.title.length > 256 ? `${selectedPost.title.slice(0, 248)}...` : selectedPost.title)
			.setImage(this.settings.type === "image" ? selectedPost.url : "")
			.setURL(`https://www.reddit.com${selectedPost.permalink}`)
			.setFooter({
				text: `👍${selectedPost.ups} | 💬${selectedPost.num_comments} | 😃u/${selectedPost.author} | ⚙️r/${selectedPost.subreddit}`,
				iconURL: bot.user.displayAvatarURL()
			})
			.setColor(bot.config.embed.color);

		if (this.settings.type === "text") RedditEmbed.setDescription(selectedPost.selftext);

		await message.replyT({
			embeds: [RedditEmbed]
		});
	}
};
