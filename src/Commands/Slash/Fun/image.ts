const Discord = require("discord.js");
const canvacord = require("canvacord");

const cmd = require("@structures/command");

async function capFirstLetter(string: string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

async function generate(bot: any, message: any, data: any) {
	const state = data.options.getSubcommand();

	if (state === "text") {
		const type = data.options.getString("type");
		const text = Discord.Util.cleanContent(data.options.getString("text"), message.channel);

		if (type === "changemymind") return await canvacord.Canvas.changemymind(text);
		else if (type === "ohno") return await canvacord.Canvas.ohno(text);
		else if (type === "clyde") return await canvacord.Canvas.clyde(text);
	} else if (state === "user") {
		const type = data.options.getString("type");
		const user = data.options.getUser("user") || message.user;

		if (type === "jail") return await canvacord.Canvas.jail(user.displayAvatarURL({ format: "png" }));
		else if (type === "garbage") return await canvacord.Canvas.shit(user.displayAvatarURL({ format: "png" }));
		else if (type === "facepalm") return await canvacord.Canvas.facepalm(user.displayAvatarURL({ format: "png" }));
		else if (type === "affect") return await canvacord.Canvas.affect(user.displayAvatarURL({ format: "png" }));
		else if (type === "beautiful") return await canvacord.Canvas.beautiful(user.displayAvatarURL({ format: "png" }));
		else if (type === "invert") return await canvacord.Canvas.invert(user.displayAvatarURL({ format: "png" }));
		else if (type === "rainbow") return await canvacord.Canvas.rainbow(user.displayAvatarURL({ format: "png" }));
		else if (type === "rip") return await canvacord.Canvas.rip(user.displayAvatarURL({ format: "png" }));
		else if (type === "trash") return await canvacord.Canvas.trash(user.displayAvatarURL({ format: "png" }));
		else if (type === "trigger") return await canvacord.Canvas.trigger(user.displayAvatarURL({ format: "png" }));
		else if (type === "wasted") return await canvacord.Canvas.wasted(user.displayAvatarURL({ format: "png" }));
		else if (type === "wanted") return await canvacord.Canvas.wanted(user.displayAvatarURL({ format: "png" }));
	} else if (state === "slap") {
		const user = data.options.getUser("user") || message.user;
		const user2 = data.options.getUser("user2") || message.user;

		return await canvacord.Canvas.slap(
			user.displayAvatarURL({ format: "png" }),
			user2.displayAvatarURL({ format: "png" })
		);
	} else if (state === "bed") {
		const user = data.options.getUser("user") || message.user;
		const user2 = data.options.getUser("user2");

		return await canvacord.Canvas.bed(
			user2.displayAvatarURL({ format: "png" }),
			user.displayAvatarURL({ format: "png" })
		);
	} else if (state === "opinion") {
		const user = data.options.getUser("user") || message.user;
		const text = Discord.Util.cleanContent(data.options.getString("text"), message.channel);

		return await canvacord.Canvas.opinion(user.displayAvatarURL({ format: "png" }), text);
	} else if (state === "color") {
		const hex = data.options.getString("hex");

		return await canvacord.Canvas.color(hex);
	} else if (state === "youtube") {
		const user = data.options.getUser("user") || message.user;
		const text = data.options.getString("text");
		const dark = data.options.getBoolean("dark");

		return await canvacord.Canvas.youtube({
			username: user.username,
			avatar: user.displayAvatarURL({ format: "png" }),
			content: text,
			dark
		});
	}
}

module.exports = new cmd(async (bot: any, message: any, args: string[], command: any, data: any) => {
	const loadingEmbed = new Discord.MessageEmbed()
		.setAuthor({
			name: message.user.tag,
			iconURL: message.user.displayAvatarURL({ dynamic: true })
		})
		.setTitle(await message.translate(`${bot.config.emojis.stats} | Creating image...`))
		.setDescription(await message.translate(`Please wait while I generate the image...`))
		.setFooter({
			text: bot.config.embed.footer,
			iconURL: bot.user.displayAvatarURL({ dynamic: true })
		})
		.setColor(bot.config.embed.color)
		.setTimestamp();

	const ImageLoading = await message.replyT({
		embeds: [loadingEmbed]
	});

	const imageName: string = await data.options.getString("type") || await data.options.getSubcommand();
	try {
		const generateImage: any = await generate(bot, message, data);
		const Image: any = new Discord.MessageAttachment(generateImage, `${imageName}.${imageName === "trigger" ? "gif" : "png"}`);

		const ImageEmbed: any = new Discord.MessageEmbed()
			.setAuthor({
				name: `${message.user.tag}`,
				iconURL: message.user.displayAvatarURL({ format: "png" })
			})
			.setTitle(await message.translate(`${bot.config.emojis.stats} | ${capFirstLetter(imageName)}`))
			.setImage(`attachment://${imageName}.${imageName === "trigger" ? "gif" : "png"}`)
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
		} catch (err: any) { }
	} catch (err: any) {
		bot.logger(err, "error");

		const ImageEmbed = new Discord.MessageEmbed()
			.setTitle(await message.translate(`${bot.config.emojis.error} | ${capFirstLetter(imageName === "trigger" ? "gif" : "png")}`))
			.setDescription(await message.translate("An error occured while creating the image. Please try again later!"))
			.setColor("RED");

		try {
			await ImageLoading?.edit({
				embeds: [ImageEmbed]
			});
		} catch (err: any) { }
	}
}, {
	description: "<:image:948004558884442142> Generate images with ease.",
	aliases: [],
	usage: `(image type)`,
	slash: true,
	slashOnly: true,
	cooldowns: 5,
	options: [
		{
			type: 1,
			name: "text",
			description: "Generate an image using text.",
			options: [
				{
					type: 3,
					name: "type",
					description: "The type of text image to generate.",
					required: true,
					choices: [
						{
							name: "ohno",
							value: "ohno"
						},
						{
							name: "changemymind",
							value: "changemymind"
						},
						{
							name: "clyde",
							value: "clyde"
						}
					]
				},
				{
					type: 3,
					name: "text",
					description: "The text for the image.",
					required: true
				}
			]
		},
		{
			type: 1,
			name: "user",
			description: "Generate an image using a user.",
			options: [
				{
					type: 3,
					name: "type",
					description: "The type of user image to generate.",
					required: true,
					choices: [
						{
							name: "jail",
							value: "jail"
						},
						{
							name: "garbage",
							value: "garbage"
						},
						{
							name: "facepalm",
							value: "facepalm"
						},
						{
							name: "affect",
							value: "affect"
						},
						{
							name: "beautiful",
							value: "beautiful"
						},
						{
							name: "invert",
							value: "invert"
						},
						{
							name: "rainbow",
							value: "rainbow"
						},
						{
							name: "rip",
							value: "rip"
						},
						{
							name: "trash",
							value: "trash"
						},
						{
							name: "trigger",
							value: "trigger"
						},
						{
							name: "wanted",
							value: "wanted"
						},
						{
							name: "wasted",
							value: "wasted"
						}
					]
				},
				{
					type: 6,
					name: "user",
					description: "The user to show in the image.",
					required: true
				}
			]
		},
		{
			type: 1,
			name: "opinion",
			description: "Oh my, that's a very bad opinion.",
			options: [
				{
					type: 6,
					name: "user",
					description: "The user to show as a father's son saying a very bad opinion.",
					required: true
				},
				{
					type: 3,
					name: "text",
					description: "The very bad opinion that the father is very mad at.",
					required: true
				}
			]
		},
		{
			type: 1,
			name: "bed",
			description: "Why do you hate me, brother?",
			options: [
				{
					type: 6,
					name: "user2",
					description: "The user on the top of the bed, who calls his brother a monster.",
					required: true
				},
				{
					type: 6,
					name: "user",
					description: "The user to show in the bed."
				}
			]
		},
		{
			type: 1,
			name: "slap",
			description: "Damn, you really hurt him bad.",
			options: [
				{
					type: 6,
					name: "user2",
					description: "The user who is getting slapped.",
					required: true
				},
				{
					type: 6,
					name: "user",
					description: "The user who is slapping the other user. Leave blank to be you."
				}
			]
		},
		{
			type: 1,
			name: "color",
			description: "Hex to color.",
			options: [
				{
					type: 3,
					name: "hex",
					description: "The hex color code to show."
				}
			]
		},
		{
			type: 1,
			name: "youtube",
			description: "Make a user say something from a YouTube comment.",
			options: [
				{
					type: 3,
					name: "text",
					description: "The text of the comment.",
					required: true
				},
				{
					type: 5,
					name: "dark",
					description: "Whether or not to use the dark theme of YouTube."
				},
				{
					type: 6,
					name: "user",
					description: "The user who typed the comment."
				}
			]
		}
	]
});
