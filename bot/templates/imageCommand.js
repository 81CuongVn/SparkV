const Discord = require("discord.js");
const canvacord = require("canvacord");

const NewCommand = require("./command");

function capFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = class ModCommand {
	constructor(sett) {
		this.settings = new NewCommand(null, Object.assign({ cooldown: 2.5 * 1000 }, sett)).settings;
	}

	async run(bot, message, args, command, data) {
		const loadingEmbed = new Discord.MessageEmbed()
			.setAuthor({
				name: message.user.tag,
				iconURL: message.user.displayAvatarURL({ dynamic: true })
			})
			.setTitle(await message.translate(`${bot.config.emojis.stats} | Creating image...`))
			.setDescription(await message.translate(`Please wait while I generate the image...`))
			.setFooter({
				text: bot.config.embed.footer,
				icon_url: bot.user.displayAvatarURL({ dynamic: true })
			})
			.setColor(bot.config.embed.color)
			.setTimestamp();

		const ImageLoading = await message.replyT({
			embeds: [loadingEmbed],
		});

		try {
			const generateImage = await this.settings.generate(bot, message, data);
			const Image = new Discord.MessageAttachment(generateImage, `${this.settings.name}.${this.settings?.type || "png"}`);

			const ImageEmbed = new Discord.MessageEmbed()
				.setAuthor({
					name: `${message.user.tag}`,
					iconURL: message.user.displayAvatarURL({ format: "png" })
				})
				.setTitle(await message.translate(`${bot.config.emojis.stats} | ${capFirstLetter(this.settings.name)}`))
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
				.setTitle(await message.translate(`${bot.config.emojis.error} | ${capFirstLetter(this.settings.name)}`))
				.setDescription(await message.translate("An error occured while creating the image. Please try again later!"))
				.setColor("RED");

			try {
				await ImageLoading?.edit({
					embeds: [ImageEmbed]
				});
			} catch (err) { }
		}
	}
};
