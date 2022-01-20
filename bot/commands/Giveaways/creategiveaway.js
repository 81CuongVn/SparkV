/* eslint-disable arrow-body-style */
const Discord = require(`discord.js`);
const ms = require(`ms`);

const cmd = require("../../templates/command");

const cFilter = async m => {
	if (m.author.id === m.client.user.id) {
		return false;
	}

	if (m.mentions.channels.first()) {
		return true;
	} else {
		await m.replyT("That's not a channel. Try again.");

		return false;
	}
};

const tFilter = async m => {
	if (m.author.id === m.client.user.id) {
		return false;
	}

	if (ms(m.content)) {
		return true;
	} else {
		await m.replyT(`Invalid duration format. Please try again.
    **Examples**
    1s
    1m
    1h
    1d

    **Key**
    s = seconds
    m = minutes
    h = hours
    d = days
    `);

		return false;
	}
};

const wcFilter = async m => {
	if (m.author.id === m.client.user.id) {
		return false;
	}

	if (m.content) {
		if (isNaN(m.content) || parseInt(m.content) < 1) {
			await message.replyT(`${bot.config.emojis.error} | Please provide a valid __number__ of winners (The number should also be higher than 0). Try again.`);

			return false;
		}

		return true;
	} else {
		await m.replyT("Next time, reply with a number. You cannot have zero winners.");

		return false;
	}
};

const pFilter = async m => {
	if (m.author.id === m.client.user.id) {
		return false;
	}

	if (m.content) {
		if (m.content.length >= 256) {
			await m.replyT(`${bot.config.emojis.error} | The prize cannot be longer than 255 characters. Try again.`);

			return false;
		}

		return true;
	} else {
		await m.replyT("Dude... I need you to send a valid message.");
		return false;
	}
};

const messageCollectorError = async (message, collected) => await message.replyT("Canceled due to no valid response within 30 seconds.");

async function execute(bot, message, args, command, data) {
	let channel;
	let duration;
	let winnerCount;
	let prize;

	await message.replyT("What channel would you like to create a giveaway in? You have 30 seconds to send a channel.").then(async () => {
		await message.channel.awaitMessages({ filter: cFilter, max: 1, time: 30 * 1000, errors: ["time"] }).then(async collected => {
			channel = collected.first().content.slice(2, -1);

			await message.replyT("How long should this giveaway last for? You have 30 seconds. (Example: 1 day)").then(async () => {
				await message.channel.awaitMessages({ filter: tFilter, max: 1, time: 30 * 1000, errors: ["time"] }).then(async collected => {
					duration = ms(collected.first().content);

					await message.replyT("Almost there! How many winners should there be? You have 30 seconds.").then(async () => {
						await message.channel.awaitMessages({ filter: wcFilter, max: 1, time: 30 * 1000, errors: ["time"] }).then(async collected => {
							winnerCount = parseInt(collected.first().content);

							await message.replyT("And finaly, what will be the prize? You have 30 seconds.").then(async () => {
								await message.channel.awaitMessages({ filter: pFilter, max: 1, time: 30 * 1000, errors: ["time"] }).then(async collected => {
									prize = collected.first().content;
								}).catch(async collected => messageCollectorError(message, collected));
							}).catch(async collected => messageCollectorError(message, collected));
						});
					}).catch(async collected => messageCollectorError(message, collected));
				});
			}).catch(async collected => messageCollectorError(message, collected));
		});
	});

	if (!bot.channels.cache.get(channel)) {
		channel = await bot.channels.fetch(channel);
	} else {
		channel = bot.channels.cache.get(channel);
	}

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
			noWinner: `${bot.config.emojis.error} |  Couldn't determine a winner. Please do ^Reroll.`,
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

	await message.replyT(`${bot.config.emojis.success} | Giveaway starting in <#${channel.id}>!`);
}

module.exports = new cmd(execute, {
	description: `Creates a giveaway. Requires the permision MANAGE_MESSAGES.`,
	dirname: __dirname,
	usage: ``,
	aliases: ["startg", "sgiveaway", "cgiveaway", "createg"],
	perms: ["EMBED_LINKS", "MANAGE_MESSAGES"]
});
