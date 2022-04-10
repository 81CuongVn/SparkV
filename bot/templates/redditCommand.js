const Discord = require("discord.js");
const fetch = require("axios");

const NewCommand = require("./command");

const filters = {
	image: post => post.data.post_hint === "image",
	text: post => post.data.post_hint !== "image" && post.data.selftext.length <= 2000 && post.data.title.length <= 256,
};

module.exports = class RedditCommand {
	constructor(sett) {
		this.settings = new NewCommand(
			null,
			Object.assign(
				{
					cooldown: 2 * 1000,
					slash: true,
					bot_perms: ["EMBED_LINKS"],
				},
				sett,
			),
		).settings;
	}

	async run(bot, message, args, command, data) {
		let endpoint = this.settings.endpoint;

		if (data?.options?.getString("type")) endpoint = data?.options?.getString("type");

		let res;
		const cache = await bot.redis.get(endpoint).then(res => JSON.parse(res));

		if (cache) {
			res = cache;
		} else {
			res = await fetch.get(`https://www.reddit.com${endpoint}`)
				.then(res => res.data)
				.catch(() => null);

			await bot.redis.set(endpoint, JSON.stringify(res), {
				EX: 15 * 60
			});
		}

		if (!res) return;

		const posts = res.data.children.filter(filters[this.settings.type]);
		const selectedPost = posts[Math.floor(Math.random() * Object.keys(posts).length)].data;

		const RedditEmbed = new Discord.MessageEmbed()
			.setTitle(selectedPost.title.length > 256 ? `${selectedPost.title.slice(0, 248)}...` : selectedPost.title)
			.setImage(this.settings.type === "image" ? selectedPost.url : "")
			.setURL(`https://www.reddit.com${selectedPost.permalink}`)
			.setFooter({
				text: `👍${selectedPost.ups} | 💬${selectedPost.num_comments} | 😃u/${selectedPost.author} | ⚙️r/${selectedPost.subreddit}`,
				iconURL: bot.user.displayAvatarURL()
			})
			.setColor(bot.config.embed.color);

		if (this.settings.type === "text") {
			RedditEmbed.setDescription(selectedPost.selftext);
		}

		await message.replyT({
			embeds: [RedditEmbed]
		});
	}
};
