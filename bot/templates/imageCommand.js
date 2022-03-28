const Discord = require("discord.js");
const canvacord = require("canvacord");

const NewCommand = require("./command");

module.exports = class ModCommand {
	constructor(sett) {
		this.settings = new NewCommand(null, Object.assign({ cooldown: 2.5 * 1000 }, sett)).settings;
	}

	async run(bot, message, args, command, data) {
		const ImageLoading = await message.replyT(`${bot.config.emojis.stats} | Creating image...`);

		try {
			const generateImage = await this.settings.generate(bot, message, data);
			const Image = new Discord.MessageAttachment(generateImage, `${this.settings.name}.${this.settings?.type || "png"}`);

			const ImageEmbed = new Discord.MessageEmbed()
				.setAuthor({
					name: `${message.user.tag}`,
					iconURL: message.user.displayAvatarURL({ format: "png" })
				})
				.setTitle("Image Creation Successful!")
				.setImage(`attachment://${this.settings.name}.${this.settings?.type || "png"}`)
				.setFooter({
					text: bot.config.embed.footer,
					iconURL: bot.user.displayAvatarURL({ format: "png" })
				})
				.setColor("GREEN");

			try {
				await ImageLoading.edit({
					embeds: [ImageEmbed],
					files: [Image]
				});
			} catch (err) { }
		} catch (err) {
			bot.logger(err, "error");

			const ImageEmbed = new Discord.MessageEmbed()
				.setTitle(this.settings.name)
				.setDescription("An error occured while creating the image. Please try again later!")
				.setColor("RED");

			try {
				await ImageLoading?.edit({
					embeds: [ImageEmbed]
				});
			} catch (err) { }
		}
	}
};
