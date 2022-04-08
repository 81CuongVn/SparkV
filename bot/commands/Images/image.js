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
			name: "jail",
			description: "Show someone's avatar in jail.",
			options: [
				{
					type: 6,
					name: "user",
					description: "The user to show in jail."
				}
			]
		},
		{
			type: 1,
			name: "shit",
			description: "Ewww! I stept in shit!!",
			options: [
				{
					type: 6,
					name: "user",
					description: "The user to show as shit."
				}
			]
		},
		{
			type: 1,
			name: "facepalm",
			description: "Bro, seriously?",
			options: [
				{
					type: 6,
					name: "user",
					description: "The user to facepalm."
				}
			]
		},
		{
			type: 1,
			name: "affect",
			description: "This won't affect my child at all!",
			options: [
				{
					type: 6,
					name: "user",
					description: "The user."
				}
			]
		},
		{
			type: 1,
			name: "beautiful",
			description: "Oh this- this is beautiful!",
			options: [
				{
					type: 6,
					name: "user",
					description: "The user."
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
					description: "The brother, who is being called a monster."
				}
			]
		},
		{
			type: 1,
			name: "changemymind",
			description: "The \"Change my mind\" meme.",
			options: [
				{
					type: 3,
					name: "text",
					description: "The text to change my mind about.",
					required: true
				}
			]
		},
		{
			type: 1,
			name: "invert",
			description: "Invert the colors on somebody's avatar.",
			options: [
				{
					type: 6,
					name: "user",
					description: "The user to invert their profile picture.",
					required: true
				}
			]
		},
		{
			type: 1,
			name: "ohno",
			description: "Oh no! He's stupid!!",
			options: [
				{
					type: 3,
					name: "text",
					description: "The text to make the dog in the meme say.",
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
			name: "rainbow",
			description: "Damn, you really like rainbows.",
			options: [
				{
					type: 6,
					name: "user",
					description: "The user to show a rainbow over.",
				}
			]
		},
		{
			type: 1,
			name: "rip",
			description: "Rest In Peace.",
			options: [
				{
					type: 6,
					name: "user",
					description: "The user to put on a tombstone.",
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
		},
		{
			type: 1,
			name: "trash",
			description: "Compare someone to trash.",
			options: [
				{
					type: 6,
					name: "user",
					description: "The user to trash.",
				}
			]
		},
		{
			type: 1,
			name: "trigger",
			description: "Dude, calm down.",
			options: [
				{
					type: 6,
					name: "user",
					description: "The user to show that they are triggered.",
				}
			]
		},
		{
			type: 1,
			name: "clyde",
			description: "Clyde from Discord lol.",
			options: [
				{
					type: 3,
					name: "text",
					description: "The text clyde will say.",
					required: true
				}
			]
		},
		{
			type: 1,
			name: "wanted",
			description: "Wow, you have a wanted poster.",
			options: [
				{
					type: 6,
					name: "user",
					description: "The user to show on the wanted poster.",
				}
			]
		},
		{
			type: 1,
			name: "wasted",
			description: "Dang, you're wasted.",
			options: [
				{
					type: 6,
					name: "user",
					description: "The user to show wasted."
				}
			]
		},
	],
	generate: async function(bot, message, data) {
		const state = data.options.getSubcommand();

		if (state === "jail") {
			const user = data.options.getUser("user") || message.user;

			return await canvacord.Canvas.jail(user.displayAvatarURL({ format: "png" }));
		} else if (state === "shit") {
			const user = data.options.getUser("user") || message.user;

			return await canvacord.Canvas.shit(user.displayAvatarURL({ format: "png" }));
		} else if (state === "facepalm") {
			const user = data.options.getUser("user") || message.user;

			return await canvacord.Canvas.facepalm(user.displayAvatarURL({ format: "png" }));
		} else if (state === "affect") {
			const user = data.options.getUser("user") || message.user;

			return await canvacord.Canvas.affect(user.displayAvatarURL({ format: "png" }));
		} else if (state === "beautiful") {
			const user = data.options.getUser("user") || message.user;

			return await canvacord.Canvas.beautiful(user.displayAvatarURL({ format: "png" }));
		} else if (state === "bed") {
			const user = data.options.getUser("user") || message.user;
			const user2 = data.options.getUser("user2");

			return await canvacord.Canvas.bed(user.displayAvatarURL({ format: "png" }), user2.displayAvatarURL({ format: "png" }));
		} else if (state === "changemymind") {
			const text = data.options.getString("text");

			return await canvacord.Canvas.changemymind(text);
		} else if (state === "invert") {
			const user = data.options.getUser("user") || message.user;

			return await canvacord.Canvas.invert(user.displayAvatarURL({ format: "png" }));
		} else if (state === "ohno") {
			const user = data.options.getString("text");

			return await canvacord.Canvas.ohno(text);
		} else if (state === "opinion") {
			const user = data.options.getUser("user");
			const text = data.options.getString("text");

			return await canvacord.Canvas.opinion(user.displayAvatarURL({ format: "png" }), text);
		} else if (state === "rainbow") {
			const user = data.options.getUser("user") || message.user;

			return await canvacord.Canvas.rainbow(user.displayAvatarURL({ format: "png" }));
		} else if (state === "rip") {
			const user = data.options.getUser("user") || message.user;

			return await canvacord.Canvas.rip(user.displayAvatarURL({ format: "png" }));
		} else if (state === "slap") {
			const user = data.options.getUser("user") || message.user;
			const user2 = data.options.getUser("user2") || message.user;

			return await canvacord.Canvas.slap(user.displayAvatarURL({ format: "png" }), user2.displayAvatarURL({ format: "png" }));
		} else if (state === "trash") {
			const user = data.options.getUser("user") || message.user;

			return await canvacord.Canvas.trash(user.displayAvatarURL({ format: "png" }));
		} else if (state === "trigger") {
			const user = data.options.getUser("user") || message.user;

			return await canvacord.Canvas.trigger(user.displayAvatarURL({ format: "png" }));
		} else if (state === "clyde") {
			const text = data.options.getString("text");

			return await canvacord.Canvas.clyde(text);
		} else if (state === "wanted") {
			const user = data.options.getUser("user") || message.user;

			return await canvacord.Canvas.wanted(user.displayAvatarURL({ format: "png" }));
		} else if (state === "wasted") {
			const user = data.options.getUser("user") || message.user;

			return await canvacord.Canvas.wasted(user.displayAvatarURL({ format: "png" }));
		}
	}
});
