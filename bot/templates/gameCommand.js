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
			const channel = data.options.getChannel("channel");
			const type = data.options.getString("type");

			bot.discordTogether.createTogetherCode(channel?.id, type?.toLowerCase())
				.then(async invite => await message.replyT(`${bot.config.emojis.success} | Click [here](${invite.code}) to start playing **${type}** in ${channel}.`))
				.catch(async err => await message.replyT(`${bot.config.emojis.alert} | Uh oh! Looks like an error occured. Sorry about that. Please try again later.`))
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
				filter: interaction => interaction.deferUpdate().catch(err => {}),
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
