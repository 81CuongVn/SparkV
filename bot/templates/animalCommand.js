const Discord = require("discord.js");
const fetch = require("axios");

const NewCommand = require("./command");

module.exports = class RedditCommand {
	constructor(sett) {
		this.settings = new NewCommand(
			null,
			Object.assign(
				{
					cooldown: 3 * 1000,
					slash: true,
					perms: ["EMBED_LINKS"],
				},
				sett,
			),
		).settings;
	}

	async run(bot, message, args, command) {
		const data = await fetch.get(`${this.settings.endpoint}`).then(response => response.data);
		let body;

		if (data?.message) body = data.message;
		if (data?.file) body = data.file;
		if (data?.image) body = data.image;
		if (data?.url) body = data.url;

		const ImageEmbed = new Discord.MessageEmbed()
			.setTitle("😍 | Awwwww")
			.setImage(body)
			.setFooter(`Powered by ${this.settings.endpoint} • ${bot.config.embed.footer}`, bot.user.displayAvatarURL())
			.setColor(bot.config.embed.color);

		await message.reply({
			embeds: [ImageEmbed],
		});
	}
};
