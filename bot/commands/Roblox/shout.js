const Discord = require(`discord.js`);
const request = require(`axios`);

const cmd = require("../../templates/command");

async function execute(bot, message, args, command) {
	if (!args) {
		return await message.replyT(`${bot.config.emojis.error} | Next time, respond with the ID of the game lmao.`);
	}

	request.get(`https://roblox-embed-discord-jpcnmriva99q.runkit.sh/${args}.response.data`)
		.then(async response => {
			const Embed = new Discord.MessageEmbed()
				.setTitle(response.data.title)
				.setDescription(response.data.description)
				.setImage(response.data.image.url)
				.setThumbnail(response.data.thumbnail.url)
				.setAuthor({
					name: response.data.author.name,
					iconURL: response.data.author.icon_url,
					url: response.data.author.url
				})
				.addFields(response.data.fields)
				.setFooter(response.data.footer.text, response.data.footer.icon_url)
				.setURL(response.data.url)
				.setColor(response.data.color)
				.setTimestamp();

			await message.replyT({
				embeds: [Embed],
			});
		})
		.catch(async err => await message.replyT(`${bot.config.emojis.error} | An error occured!`));
}

module.exports = new cmd(execute, {
	description: "SparkV will shout to any group owned by you!",
	dirname: __dirname,
	usage: "<Shout Message>",
	enabled: false,
	aliases: [],
	perms: ["EMBED_LINKS"],
});
