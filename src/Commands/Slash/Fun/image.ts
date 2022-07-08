import Discord, { Colors } from "discord.js";
import canvacord from "canvacord";

import cmd from "../../../structures/command";

function capFirstLetter(string: string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

async function generate(bot: any, message: any, data: any) {
	const state = data.options.getSubcommand();

	if (state === "text") {
		const type = data.options.getString("type");
		const text = bot.functions.cleanContent(data.options.getString("text"), message.channel);

		if (type === "changemymind") return await (canvacord as any).Canvas.changemymind(text);
		else if (type === "ohno") return await (canvacord as any).Canvas.ohno(text);
		else if (type === "clyde") return await (canvacord as any).Canvas.clyde(text);
	} else if (state === "user") {
		const type = data.options.getString("type");
		const user = data.options.getUser("user") || message.user;

		if (type === "jail") return await (canvacord as any).Canvas.jail(user.displayAvatarURL({ extension: "png" }));
		else if (type === "garbage") return await (canvacord as any).Canvas.shit(user.displayAvatarURL({ extension: "png" }));
		else if (type === "facepalm") return await (canvacord as any).Canvas.facepalm(user.displayAvatarURL({ extension: "png" }));
		else if (type === "affect") return await (canvacord as any).Canvas.affect(user.displayAvatarURL({ extension: "png" }));
		else if (type === "beautiful") return await (canvacord as any).Canvas.beautiful(user.displayAvatarURL({ extension: "png" }));
		else if (type === "invert") return await (canvacord as any).Canvas.invert(user.displayAvatarURL({ extension: "png" }));
		else if (type === "rainbow") return await (canvacord as any).Canvas.rainbow(user.displayAvatarURL({ extension: "png" }));
		else if (type === "rip") return await (canvacord as any).Canvas.rip(user.displayAvatarURL({ extension: "png" }));
		else if (type === "trash") return await (canvacord as any).Canvas.trash(user.displayAvatarURL({ extension: "png" }));
		else if (type === "trigger") return await (canvacord as any).Canvas.trigger(user.displayAvatarURL({ extension: "png" }));
		else if (type === "wasted") return await (canvacord as any).Canvas.wasted(user.displayAvatarURL({ extension: "png" }));
		else if (type === "wanted") return await (canvacord as any).Canvas.wanted(user.displayAvatarURL({ extension: "png" }));
	} else if (state === "slap") {
		const user = data.options.getUser("user") || message.user;
		const user2 = data.options.getUser("user2") || message.user;

		return await (canvacord as any).Canvas.slap(
			user.displayAvatarURL({ extension: "png" }),
			user2.displayAvatarURL({ extension: "png" })
		);
	} else if (state === "bed") {
		const user = data.options.getUser("user") || message.user;
		const user2 = data.options.getUser("user2");

		return await (canvacord as any).Canvas.bed(
			user2.displayAvatarURL({ extension: "png" }),
			user.displayAvatarURL({ extension: "png" })
		);
	} else if (state === "opinion") {
		const user = data.options.getUser("user") || message.user;
		const text = bot.functions.cleanContent(data.options.getString("text"), message.channel);

		return await (canvacord as any).Canvas.opinion(user.displayAvatarURL({ extension: "png" }), text);
	} else if (state === "color") {
		const hex = data.options.getString("hex");

		return await (canvacord as any).Canvas.color(hex);
	} else if (state === "youtube") {
		const user = data.options.getUser("user") || message.user;
		const text = data.options.getString("text");
		const dark = data.options.getBoolean("dark");

		return await (canvacord as any).Canvas.youtube({
			username: user.username,
			avatar: user.displayAvatarURL({ extension: "png" }),
			content: text,
			dark
		});
	}
}

export default new cmd(async (bot: any, message: any, args: string[], command: any, data: any) => {
	const ImageLoading = await message.replyT({
		embeds: [{
			author: { name: `${message.user.tag}`, icon_url: message.user.displayAvatarURL() },
			title: await message.translate(`${bot.config.emojis.stats} | Creating image...`),
			description: await message.translate(`Please wait while I generate the image...`),
			color: Colors.Blue,
			timestamp: new Date()
		}]
	});

	const imageName: string = await data.options.getString("type") || await data.options.getSubcommand();
	try {
		const Image: any = await generate(bot, message, data);
		await ImageLoading.edit({
			embeds: [{
				author: { name: `${message.user.tag}`, icon_url: message.user.displayAvatarURL({ extension: "png" }) },
				title: await message.translate(`${bot.config.emojis.stats} | ${capFirstLetter(imageName)}`),
				image: { url: `attachment://${imageName}.${imageName === "trigger" ? "gif" : "png"}` },
				color: Colors.Green,
				timestamp: new Date()
			}],
			files: [{ attachment: Image, name: `${imageName}.${imageName === "trigger" ? "gif" : "png"}` }]
		});
		
		/*
			components: [{
				type: 1,
				components: [{
					type: 2,
					label: "Download",
					emoji: "<:download:994651105709535262>",
					url: `attachment://${imageName}.${imageName === "trigger" ? "gif" : "png"}`,
					style: 5
				}]
			}],
		*/
	} catch (err: any) {
		bot.logger(err, "error");

		try {
			await ImageLoading?.edit({
				embeds: [{
					title: await message.translate(`${bot.config.emojis.error} | ${capFirstLetter(imageName === "trigger" ? "gif" : "png")}`),
					description: await message.translate("An error occured while creating the image. Please try again later!"),
					color: Colors.Red
				}]
			});
		} catch (err: any) { }
	}
}, {
	description: "<:image:948004558884442142> Generate images with ease.",
	aliases: [],
	usage: `(image type)`,
	slash: true,
	cooldowns: 5,
	options: [{
		type: 1,
		name: "text",
		description: "Generate an image using text.",
		options: [{
			type: 3,
			name: "type",
			description: "The type of text image to generate.",
			required: true,
			choices: [{
				name: "ohno",
				value: "ohno"
			}, {
				name: "changemymind",
				value: "changemymind"
			}, {
				name: "clyde",
				value: "clyde"
			}]
		}, {
			type: 3,
			name: "text",
			description: "The text for the image.",
			required: true
		}
		]
	}, {
		type: 1,
		name: "user",
		description: "Generate an image using a user.",
		options: [{
			type: 3,
			name: "type",
			description: "The type of user image to generate.",
			required: true,
			choices: [{
				name: "jail",
				value: "jail"
			}, {
				name: "garbage",
				value: "garbage"
			}, {
				name: "facepalm",
				value: "facepalm"
			}, {
				name: "affect",
				value: "affect"
			}, {
				name: "beautiful",
				value: "beautiful"
			}, {
				name: "invert",
				value: "invert"
			}, {
				name: "rainbow",
				value: "rainbow"
			}, {
				name: "rip",
				value: "rip"
			}, {
				name: "trash",
				value: "trash"
			}, {
				name: "trigger",
				value: "trigger"
			}, {
				name: "wanted",
				value: "wanted"
			}, {
				name: "wasted",
				value: "wasted"
			}]
		},
		{
			type: 6,
			name: "user",
			description: "The user to show in the image.",
			required: true
		}]
	}, {
		type: 1,
		name: "opinion",
		description: "Oh my, that's a very bad opinion.",
		options: [{
			type: 6,
			name: "user",
			description: "The user to show as a father's son saying a very bad opinion.",
			required: true
		}, {
			type: 3,
			name: "text",
			description: "The very bad opinion that the father is very mad at.",
			required: true
		}]
	}, {
		type: 1,
		name: "bed",
		description: "Why do you hate me, brother?",
		options: [{
			type: 6,
			name: "user2",
			description: "The user on the top of the bed, who calls his brother a monster.",
			required: true
		}, {
			type: 6,
			name: "user",
			description: "The user to show in the bed."
		}]
	}, {
		type: 1,
		name: "slap",
		description: "Damn, you really hurt him bad.",
		options: [{
			type: 6,
			name: "user2",
			description: "The user who is getting slapped.",
			required: true
		}, {
			type: 6,
			name: "user",
			description: "The user who is slapping the other user. Leave blank to be you."
		}]
	}, {
		type: 1,
		name: "color",
		description: "Hex to color.",
		options: [{
			type: 3,
			name: "hex",
			description: "The hex color code to show."
		}]
	}, {
		type: 1,
		name: "youtube",
		description: "Make a user say something from a YouTube comment.",
		options: [{
			type: 3,
			name: "text",
			description: "The text of the comment.",
			required: true
		}, {
			type: 5,
			name: "dark",
			description: "Whether or not to use the dark theme of YouTube."
		}, {
			type: 6,
			name: "user",
			description: "The user who typed the comment."
		}]
	}]
});
