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
					perms: ["EMBED_LINKS"],
				},
				sett,
			),
		).settings;
	}

	async run(bot, message, args, command) {
		let res;
		const cache = await bot.redis.getAsync(this.settings.endpoint).then(res => JSON.parse(res));

		if (cache) {
			res = cache;
		} else {
			res = await fetch.get(`https://www.reddit.com${this.settings.endpoint}`)
				.then(res => res.data)
				.catch(() => null);

			bot.redis.setAsync(this.settings.endpoint, JSON.stringify(res), "EX", 15 * 60);
		}

		if (!res) {
			return;
		}

		const posts = res.data.children.filter(filters[this.settings.type]);
		const selectedPost = posts[Math.floor(Math.random() * Object.keys(posts).length)].data;

		const RedditEmbed = new Discord.MessageEmbed()
			.setTitle(selectedPost.title.length > 256 ? `${selectedPost.title.slice(0, 248)}...` : selectedPost.title)
			.setImage(this.settings.type === "image" ? selectedPost.url : "")
			.setURL(`https://www.reddit.com${selectedPost.permalink}`)
			.setFooter(
				`👍${selectedPost.ups} | 💬${selectedPost.num_comments} | 😃u/${selectedPost.author} | ⚙️r/${selectedPost.subreddit} • ${bot.config.embed.footer}`,
				bot.user.displayAvatarURL(),
			)
			.setColor(bot.config.embed.color);

		if (this.settings.type === "text") {
			RedditEmbed.setDescription(selectedPost.selftext);
		}

		await message.reply({
			embeds: [RedditEmbed]
		});
	}
};
