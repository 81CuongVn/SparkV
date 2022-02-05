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
			let One = null;

			if (this.settings?.useText === true) {
				if (!args || !args[0]) {
					const provideText = await message.replyT(`Please provide text.`);

					await message.channel.awaitMessages({
						filter: msg => {
							if (msg.author.id === msg.client.user.id) return false;

							if (!msg.content) {
								msg.replyT("Please send valid text!");

								return false;
							}

							return true;
						}, max: 1, time: 15 * 1000, errors: ["time"]
					}).then(async collected => {
						const input = parseInt(collected.first().content);

						args = provideText.trim().split(/ +/g);
						console.log(args);

						collected.first().delete().catch(err => { });
						provideText.delete().catch(err => { });
					}).catch(async collected => {
						await message.replyT("Canceled due to no valid response within 30 seconds.");

						return false;
					});
				}

				One = args.join(" ");
			}

			if (!One) One = (await bot.functions.fetchUser(this.settings?.useAuthorFirst === true ? message.author : args[0]) || message.author).displayAvatarURL({ format: "png" });
			let Two = null;

			if (this.settings?.user2 === true && !this.settings.useText) Two = (await bot.functions.fetchUser(this.settings?.useAuthorFirst === true ? (args[1] ? args[1] : args[0]) : message.author) || message.author).displayAvatarURL({ format: "png" });

			const GeneratedImage = await canvacord.Canvas[this.settings.effect](One, Two);
			const Image = new Discord.MessageAttachment(GeneratedImage, `${this.settings.effect}.${this.settings?.type || "png"}`);

			console.log(Image.proxyURL);

			const ImageEmbed = new Discord.MessageEmbed()
				.setAuthor({
					name: `${this.settings.effect} | ${message.author.tag}`,
					iconURL: message.author.displayAvatarURL({ format: "png" })
				})
				.setTitle("Image Creation Successful!")
				.setImage(`attachment://${this.settings.effect}.${this.settings?.type || "png"}`)
				.setFooter({
					text: bot.config.embed.footer,
					iconURL: bot.user.displayAvatarURL({ format: "png" })
				})
				.setColor("GREEN");

			await ImageLoading.edit({
				embeds: [ImageEmbed],
				files: [Image]
			});
		} catch (err) {
			console.log(err);

			const ImageEmbed = new Discord.MessageEmbed()
				.setTitle(this.settings.name)
				.setDescription("An error occured while creating the image. Please try again later!")
				.setColor("RED");

			await ImageLoading.edit({
				embeds: [ImageEmbed]
			});
		}
	}
};
