const Discord = require("discord.js");
const axios = require("axios");

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	let website = data.options.getString("website");

	if (!website.includes("https://")) website = `https://${website}/`;
	if (website.length > 200) return await message.replyT(`${bot.config.emojis.error} | Please keep the text under 100 characters.`);

	const ImageLoading = await message.replyT(`${bot.config.emojis.stats} | Screenshoting site (this could take a few minutes)...`);

	try {
		const screenshot = await axios.get(`https://image.thum.io/get/width/1920/crop/675/noanimate/${website}`, {
			responseType: "arraybuffer"
		}).then(async data => {
			data = Buffer.from(data.data, "base64");

			const Image = new Discord.MessageAttachment(data, `${website.split(".")[0]}.png`);
			const ImageEmbed = new Discord.MessageEmbed()
				.setAuthor({
					name: message.user.tag,
					iconURL: message.user.displayAvatarURL({ format: "png" })
				})
				.setTitle(`Screenshot of ${website}`)
				.setImage(`attachment://${website.split(".")[0]}.png`)
				.setFooter({
					text: bot.config.embed.footer,
					iconURL: bot.user.displayAvatarURL({ format: "png" })
				})
				.setColor("GREEN");

			await ImageLoading.edit({
				embeds: [ImageEmbed],
				files: [Image]
			});
		});
	} catch (err) {
		bot.logger(err, "error");

		const ImageEmbed = new Discord.MessageEmbed()
			.setTitle(`Screenshot of ${website} Failed!`)
			.setDescription("An error occured while trying to take a screenshot of this website. This could be either because you supplied a bad URL, or the website you sent isn't working right. Please try again later!")
			.addField("Error", err.message, true)
			.setColor("RED");

		await ImageLoading.edit({
			embeds: [ImageEmbed]
		});
	}
}

module.exports = new cmd(execute, {
	description: "Screenshot a site!",
	dirname: __dirname,
	aliases: [],
	usage: `(website URL)`,
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 3,
			name: "website",
			description: "Website to take a screenshot of.",
			required: true
		}
	]
});
