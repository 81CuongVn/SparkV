const discord = require("discord.js");
const akinator = require("discord.js-akinator");
const NewCommand = require("./command");

// The Type of Akinator Game to Play. ("animal", "character" or "object")
const gameTypes = ["animal", "character", "object"];

// Filter for akinator command.
const filter = async m => {
	if (m.author.id === m.client.user.id) return false;

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
		this.settings = new NewCommand(execute, Object.assign({ cooldown: 20 * 1000 }, sett)).settings;
	}

	async run(bot, message, args, command, data) {
		if (this.settings.type === "activity") {
			let type;

			if (data?.options?.getString("type") || args[0]) type = data?.options?.getString("type") || this.settings.options[0].choices.find(c => c.name === args[0]).value;

			const invalidArgs = {
				content: `${bot.config.emojis.error} | The game type must be one of the following: ${this.settings.options[0].choices.map(g => `${g.name}`).join(", ")}`,
				ephemeral: true
			};

			if (!type && args[0]) return message.applicationId ? await message.editT(invalidArgs) : await message.replyT(invalidArgs);

			const notVC = {
				content: `${bot.config.emojis.error} | You must be in a __**voice channel**__ to play this game!`,
				ephemeral: true
			};

			if (!message.member.voice.channel) return message.applicationId ? await message.editT(notVC) : await message.replyT(notVC);

			bot.discordTogether.createTogetherCode(message.member.voice.channel.id, type.toLowerCase()).then(async invite => {
				const done = {
					content: `${bot.config.emojis.success} | Click the following invite to start playing the selected game! ${invite.code}`,
					ephemeral: true
				};

				await message.applicationId ? await message.editT(done) : await message.replyT(done);
			});
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
		} else if (this.settings.type === "multiplayerGame") {
			const playersEmbed = new discord.MessageEmbed()
				.setAuthor({
					name: (message.user ? message.user : message.author).tag,
					iconURL: (message.user ? message.user : message.author).displayAvatarURL({ dynamic: true })
				})
				.setTitle(`**${(message.user ? message.user : message.author).tag}** has started a ${this.settings.name} game!`)
				.setDescription("If you would like to join, please tap the \`join\` button below within the next 30 seconds.")
				.setFooter({
					text: bot.config.embed.footer,
					iconURL: bot.user.displayAvatarURL({ dynamic: true })
				})
				.setColor("GREEN");

			const joinButton = new discord.MessageButton()
				.setCustomId("join")
				.setEmoji("🚪")
				.setLabel("Join")
				.setStyle("SUCCESS");

			const leaveButton = new discord.MessageButton()
				.setCustomId("leave")
				.setEmoji("🚪")
				.setLabel("Leave")
				.setStyle("DANGER");

			const players = [];
			const playersMessage = await message.replyT({
				embeds: [playersEmbed],
				components: [new discord.MessageActionRow().addComponents(joinButton, leaveButton)],
				fetchReply: true
			});

			players[message.author.id] = true;

			const collector = await playersMessage.createMessageComponentCollector({
				filter: interaction => interaction.deferUpdate(),
				time: 30 * 1000,
				errors: ["time"],
				max: 5
			});

			collector.on("collect", async interaction => {
				console.log(players);
				if (interaction.customId === "join") {
					if (players[m.author.id]) {
						return message.replyT({
							content: "You have already joined this game!",
							ephemeral: true
						});
					}

					players[m.author.id] = true;

					return message.replyT({
						content: "You have joined the game!",
						ephemeral: true
					});
				} else if (interaction.customId === "leave") {
					if (!players[m.author.id]) {
						return message.replyT({
							content: "You have not joined this game yet!",
							ephemeral: true
						});
					}

					players[m.author.id] = null;

					return message.replyT({
						content: "You have left the game.",
						ephemeral: true
					});
				}
			});

			collector.on("end", async collected => {
				data.players = players;

				if (this.execute) return this.execute(bot, message, args, command, data);
			});
		} else if (this.settings.type === "normal") {
			if (this.execute) return this.execute(bot, message, args, command, data);
		}
	}
};
