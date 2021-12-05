const discord = require("discord.js");
const akinator = require("discord.js-akinator");
const NewCommand = require("./command");

// The Type of Akinator Game to Play. ("animal", "character" or "object")
const gameTypes = ["animal", "character", "object"];

// Filter for akinator command.
const filter = async (bot, m) => {
	if (m.author.id === m.client.user.id) {
		return false;
	}

	if (m.content) {
		if (m.content.length > 35) {
			await m.replyT(`${bot.config.emojis.error} | The game type cannot be longer than 35 characters.`);

			return false;
		}

		if (!gameTypes.includes(m.content.toLowerCase())) {
			await m.replyT(`${bot.config.emojis.error} | The game type must be one of the following: ${gameTypes.join(", ")}`);

			return false;
		}

		return true;
	} else {
		await m.replyT("Dude... I need you to send a valid message.");
		return false;
	}
};

module.exports = class ModCommand {
	constructor(execute, sett) {
		this.execute = execute;
		this.settings = new NewCommand(execute, Object.assign({ cooldown: 60 * 1000 }, sett)).settings;
	}

	async run(bot, message, args, command, data) {
		if (this.settings.type === "together") {
			if (!message.member.voice.channel) {
				return message
					.replyT(`${bot.config.emojis.error} | You must be in a __**voice channel**__ to use this command!`);
			}

			bot.discordTogether
				.createTogetherCode(message.member.voice.channel.id, this.settings.gname)
				.then(async invite => await message.replyT(`${invite.code}`));
		} else if (this.settings.type === "game") {
			if (this.settings.gname === "akinator") {
				message.replyT("What type of game would you like to play? (animal, character or object)").then(async () => {
					await message.channel.awaitMessages({ filter, max: 1, time: 30 * 1000, errors: ["time"] }).then(async collected => {
						const gameType = collected.first().content.toLowerCase();

						await message.replyT(`Alright, let's play akinator ${gameType}! Loading...`).then(async () => {
							akinator(message, {
								gameType,
								useButtons: true,
								language: data.guild.languge
							});
						});
					}).catch(async collected => await message.replyT("Canceled due to no valid response within 30 seconds."));
				});
			} else {
				await message.replyT(`Invalid game name: \`${this.settings.gname}\``);
			}
		} else {
			await message.replyT(`Invalid game type: \`${this.settings.type}\``);
		}

		if (this.execute) {
			return this.execute(bot, message, args, command, data);
		}
	}
};
