const Discord = require("discord.js");
const canvacord = require("canvacord");

const cmd = require("@templates/imageCommand");

module.exports = new cmd({
	description: "Generate images with ease.",
	dirname: __dirname,
	aliases: [],
	usage: `(image type)`,
	slash: true,
	slashOnly: true,
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
					description: "The user who is slapping the other user. Leave blank to be you.",
				},
			]
		}
	],
	generate: async function(bot, message, data) {
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

			return await canvacord.Canvas.slap(user.displayAvatarURL({ format: "png" }), user2.displayAvatarURL({ format: "png" }));
		} else if (state === "bed") {
			const user = data.options.getUser("user") || message.user;
			const user2 = data.options.getUser("user2");

			return await canvacord.Canvas.bed(user2.displayAvatarURL({ format: "png" }), user.displayAvatarURL({ format: "png" }));
		} else if (state === "opinion") {
			const user = data.options.getUser("user");
			const text = Discord.Util.cleanContent(data.options.getString("text"), message.channel);

			return await canvacord.Canvas.opinion(user.displayAvatarURL({ format: "png" }), text);
		}
	}
});
