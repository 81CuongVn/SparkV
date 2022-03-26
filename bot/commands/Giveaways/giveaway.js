/* eslint-disable arrow-body-style */
const Discord = require(`discord.js`);
const ms = require(`ms`);

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	const state = data.options.getSubcommand();

	if (state === "create") {
		const channel = data.options.getChannel("channel");
		const duration = ms(data.options.getString("time"));
		const winnerCount = data.options.getNumber("winners");
		const prize = data.options.getString("prize");

		bot.GiveawayManager.start(channel, {
			duration,
			prize,
			winnerCount,
			hostedBy: message.author,
			pauseOptions: {
				isPaused: false,
				content: "⚠️ **GIVEAWAY PAUSED!** ⚠️",
				unPauseAfter: null,
				embedColor: "#FFFF00"
			},
			messages: {
				giveaway: `⚡ New Giveaway! ⚡`,
				giveawayEnded: `🎉 Giveaway Ended 🎉`,
				drawing: `⏳ Time remaining: **{timestamp}**! ⏳`,
				dropMessage: `🎉 Be the first to react with 🎉 to enter! 🎉`,
				inviteToParticipate: `🎉 React to enter! 🎉`,
				winMessage: `⚡ Congrats, {winners}! You won just **{this.prize}**!\n{this.messageURL} ⚡`,
				noWinner: `${bot.config.emojis.error} |  Nobody entered the giveaway!`,
				hostedBy: `❔ Giveaway hosted by {this.hostedBy}!`,
				embedFooter: `SparkV - Making your Server Better`,
				winners: `${this.winnerCount} winner(s)`,
				endedAt: `Ends at`,
				units: {
					seconds: `seconds`,
					minutes: `minutes`,
					hours: `hours`,
					days: `days`,
					pluralS: false,
				},
			},
		});

		await message.editT(`${bot.config.emojis.success} | Giveaway starting in <#${channel.id}>!`);
	} else if (state === "delete") {
		const ID = data.options.getString("id");

		const Giveaway = bot.GiveawayManager.giveaways.find(giveaway => giveaway.messageID === ID);

		if (!Giveaway) return await message.editT(`${bot.config.emojis.error} | I couldn't find a giveaway with that message ID.`);

		bot.GiveawayManager.delete(Giveaway.messageID).then(async () => await message.editT(`Giveaway successfully deleted!`)).catch(async err => {
			bot.logger(err, "error");

			await message.replyT(`${bot.config.emojis.error} | An error occured with SparkV! Please try this command again later.`);
		});
	} else if (state === "pause") {
		const ID = data.options.getString("id");

		const Giveaway = bot.GiveawayManager.giveaways.find(giveaway => giveaway.messageID === ID);

		if (!Giveaway) return await message.editT(`I couldn't find a giveaway with that message ID.`);
		if (Giveaway.pauseOptions.isPaused) return await message.editT(`Giveaway is already paused.`);

		bot.giveawaysManager.pause(messageId).then(() => {
			message.replyT("Success! Giveaway paused!");
		}).catch(err => {
			interaction.channel.send(`${bot.config.emojis.error} | An error has occurred.`);
		});

		await message.editT(`Giveaway paused!`);
	} else if (state === "resume") {
		const ID = data.options.getString("id");

		const Giveaway = bot.GiveawayManager.giveaways.find(giveaway => giveaway.messageID === ID);

		if (!Giveaway) return await message.editT(`${bot.config.emojis.error} | I couldn't find a giveaway with that message ID.`);
		if (!Giveaway.isPaused) return await message.editT(`${bot.config.emojis.error} | Giveaway is not paused.`);

		Giveaway.resume();

		await message.editT(`${bot.config.emojis.success} | Giveaway successfully resumed!`);
	} else if (state === "reroll") {
		const ID = data.options.getString("id");

		const Giveaway = bot.GiveawayManager.giveaways.find(giveaway => giveaway.messageID === ID);

		if (!Giveaway) return await message.editT(`${bot.config.emojis.error} | I couldn't find a giveaway with that message ID.`);

		bot.GiveawayManager.reroll(Giveaway.messageID).then(async () => await message.replyT("Giveaway successfully rerolled!")).catch(async err => {
			if (err.startsWith(`Giveaway with ID ${Giveaway.messageID} is not ended`)) {
				await message.replyT(`${bot.config.emojis.error} | This giveaway hasn't ended yet!`);
			} else {
				bot.logger(err, "error");

				await message.replyT(`${bot.config.emojis.error} | An error occured with SparkV! Please try this command again.`);
			}
		});
	}
}

module.exports = new cmd(execute, {
	description: `Create, delete, pause, resume, reroll, or reroll a giveaway.`,
	dirname: __dirname,
	usage: "",
	aliases: ["startg", "sgiveaway", "cgiveaway", "createg"],
	perms: ["EMBED_LINKS", "MANAGE_MESSAGES"],
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 1,
			name: "create",
			description: "Create a giveaway.",
			options: [
				{
					type: 7,
					name: "channel",
					description: "The channel to create the giveaway in.",
					required: true
				},
				{
					type: 3,
					name: "time",
					description: "How long the giveaway should last for.",
					required: true
				},
				{
					type: 3,
					name: "prize",
					description: "The price for the winners to receive.",
					required: true
				},
				{
					type: 10,
					name: "winners",
					description: "How many people can win the giveaway.",
					required: true
				}
			]
		},
		{
			type: 1,
			name: "delete",
			description: "Delete a giveaway.",
			options: [
				{
					type: 3,
					name: "id",
					description: "The message id for the giveaway. ",
					required: true
				}
			]
		},
		{
			type: 1,
			name: "reroll",
			description: "Reroll a giveaway.",
			options: [
				{
					type: 3,
					name: "id",
					description: "The message id for the giveaway. ",
					required: true
				}
			]
		}
	]
});
