const sentry = require("@sentry/node");
const Discord = require("discord.js");
const fetch = require("axios");

const cursewords = require("../cursewords.json");

const cooldowns = [];
const messages = [];

// Used for AntiSpam
function deleteMessages(bot, matches) {
	matches.forEach(message => {
		const channel = bot.channels.cache.get(message.channelID);

		if (channel) {
			const msg = channel.messages.cache.get(message.messageID);

			if (msg) {
				msg.delete().catch(err => { });
			}
		}
	});
}

// Timeout user
function timeoutUser(offense, message, data) {
	if (message.member.isCommunicationDisabled()) return;

	message.member.timeout((10 * data.member.infractionsCount) * 1000, `Placed on timeout for ${bot.functions.MSToTime((10 * data.member.infractionsCount) * 1000)} for ${offense}.`)
		.then(async () => await message.replyT(`You've been **MUTED** for ${bot.functions.MSToTime((10 * data.member.infractionsCount) * 1000)} for getting **${data.member.infractionsCount}** warning(s).`))
		.catch(async () => await message.replyT(`Failed to put ${message.member} on timeout! Please check that I have the correct permissions and my role is higher than ${message.member}.`));

	message.client.emit("automod", message, offense, data);
}

module.exports = {
	once: false,
	async execute(bot, message) {
		// If the application owner isn't ready yet, wait for it.
		if (!bot.application?.owner) await bot.application?.fetch().catch(() => {});

		// If the channel is a partial, wait for the channel to fetch.
		if (message.channel?.partial) await message.channel.fetch().catch(() => {});

		// If the message is a partial, wait for the message to fetch.
		if (message?.partial) await message.fetch().catch(() => {});

		// If the message's author is a bot, return. This prevents SparkV from responding to himself.
		if (message.author.bot) return;

		// If the message is from a DM, return. This prevents SparkV from responding to DMs.
		if (message.channel.type === "dm") return;

		const botMember = await message.guild.members.fetch(bot.user.id);

		// If the bot cannot send messages, return.
		if (!botMember.permissionsIn(message.channel).has("SEND_MESSAGES")) return;

		// If the guild is part of the guild blacklist, return.
		if (bot.config.blacklist.guilds[message.guild.id]) return await message.replyT(`Your server has been blacklisted. Reason: ${bot.config.blacklist.guilds[message.guild.id]}\n\nIf you think this ban wasn't correct, please contact support. (https://discord.gg/PPtzT8Mu3h)`);

		// Cache the member.
		if (message.guild && !message.member) await message.guild.members.fetch(message.author.id);

		// Data
		const data = {};

		// Get the Guild
		if (message.guild) {
			const guild = await bot.database.getGuild(message.guild.id);

			data.guild = guild;
			message.guild.data = data.guild;
		}

		if (message.guild) data.member = await bot.database.getMember(message.author.id, message.guild.id);

		// User data
		data.user = await bot.database.getUser(message.author.id);

		if (!data) return;

		// Plugins
		if (message.guild) {
			// Vote reminder
			if (data.user.votes.remind === "true") {
				if (43200000 - (Date.now() - data.user.votes.voted) > 0) {
					const voteEmbed = new Discord.MessageEmbed()
						.setAuthor({
							name: message.author.tag,
							iconURL: message.author.displayAvatarURL({ dynamic: true })
						})
						.setTitle("You can vote again!")
						.setDescription(`You can vote again on <:topgg:946558388261769227> **top.gg**.`)
						.setColor(bot.config.embed.color);

					const VoteButton = new Discord.MessageButton()
						.setEmoji("<:topgg:946558388261769227>")
						.setLabel("Vote")
						.setURL("https://top.gg/bot/884525761694933073")
						.setStyle("LINK");

					message.author.send({
						embeds: [voteEmbed],
						components: [new Discord.MessageActionRow().addComponents(VoteButton)]
					});
				}
			}

			// Check user for AFK Status
			if (data.user.afk) {
				data.user.afk = null;
				data.user.markModified("afk");

				await data.user.save();
				await message.replyT(bot.config.responses.AFKWelcomeMessage);
			}

			// Check mentions for AFK
			message.mentions.users.forEach(async u => {
				const mentionedUserData = await bot.database.getUser(u.id);

				if (mentionedUserData.afk) {
					await message.replyT(
						bot.config.responses.AFKMessage.toString()
							.replaceAll(`{userMentioned}`, u.username)
							.replaceAll(`{reason}`, mentionedUserData.afk || "Reason data not found!"),
					);
				}
			});

			// Check for profanity (curse words)
			if (data.guild.plugins.automod.removeProfanity === "true") {
				if (!message.channel.permissionsFor(message.member).has("MANAGE_MESSAGES")) {
					const ignoredWords = ["hello"];
					let cursed = false;

					for (var i in cursewords) {
						if (message.content.toLowerCase().includes(cursewords[i].toLowerCase())) {
							cursed = true;
						}
					}

					for (var i in ignoredWords) {
						if (message.content.toLowerCase().includes(ignoredWords[i].toLowerCase())) {
							cursed = false;
						}
					}

					if (cursed) {
						++data.member.infractionsCount;
						data.member.infractions.push({
							type: "cursing",
							date: Date.now(),
						});

						data.member.markModified("infractionsCount");
						data.member.markModified("infractions");

						message.delete().catch(err => { });
						message.replyT(`🔨 | ${message.author}, please stop cursing. If you continue, I will be forced to take action. | You have **${data.member.infractionsCount}** warning(s).`);

						timeoutUser("cursing", message, data);
					}
				}
			}

			// Check for links
			if (data.guild.plugins.automod.removeLinks === "true") {
				if (
					!message.channel.permissionsFor(message.member).has("MANAGE_MESSAGES") &&
					!message.channel.permissionsFor(message.member).has("ADMINISTRATOR") &&
					bot.functions.isURL(message.content)
				) {
					++data.member.infractionsCount;
					data.member.infractions.push({
						type: "links",
						date: Date.now(),
					});

					data.member.markModified("infractionsCount");
					data.member.markModified("infractions");
					await data.member.save();

					try {
						message.delete().catch(err => { });
					} catch (err) {
						message
							.replyT(bot.config.responses.InvalidPermisions.bot.toString().replaceAll(`{author}`, message.author));
					}

					message.replyT(`🔨 | ${message.author}, you cannot send links! If you continue to send links, I will be forced to take action. | You have **${data.member.infractionsCount}** warning(s).`);

					timeoutUser("sending links", message, data);
				}
			}

			// Check for spam
			if (data.guild.plugins.automod.removeDuplicateText === "true") {
				if (!message.channel.permissionsFor(message.member).has("MANAGE_MESSAGES") || !message.channel.permissionsFor(message.member).has("ADMINISTRATOR")) {
					if (!message.channel.name.startsWith(`spam`) && !message.channel.name.endsWith(`spam`)) {
						const member = message.member || (await message.guild.members.fetch(message.author));

						const currentMessage = {
							messageID: message.id,
							guildID: message.guild.id,
							authorID: message.author.id,
							channelID: message.channel.id,
							content: message.content,
							sendTimestamp: message.createdTimestamp,
						};

						messages.push(currentMessage);

						const foundMatches = messages.filter(
							msg => msg.authorID === message.author.id && msg.guildID === message.guild.id,
						);

						if (!foundMatches) return;

						const matches = foundMatches.filter(msg => msg.sendTimestamp > Date.now() - 6500);

						if (matches.length >= 5) {
							++data.member.infractionsCount;
							data.member.infractions.push({
								type: "spam",
								date: Date.now(),
							});

							data.member.markModified("infractionsCount");
							data.member.markModified("infractions");
							await data.member.save();

							message.replyT(`🔨 | ${message.author}, please stop spamming. If you continue to spam, you'll be punished. | You have **${data.member.infractionsCount}** warning(s).`);

							timeoutUser("spamming", message, data);
						}
					}
				}
			}

			// Leveling!
			if (data.guild.plugins.leveling.enabled === "true") {
				const oldXP = require("@database/schemas/levels.js");
				const oldData = await oldXP.findOne({
					guildID: message.guild.id,
					userID: message.author.id
				});

				if (oldData) {
					data.member.xp = oldData.xp;
					data.member.level = oldData.level;

					await data.member.save();
					await oldXP.findOneAndDelete({
						guildID: message.guild.id,
						userID: message.author.id
					});
				}

				const RandomXP = Math.floor(Math.random() * 15) + 5;

				data.member.xp += parseInt(RandomXP, 10);
				data.member.level = Math.floor(0.1 * Math.sqrt(data.member.xp));

				await data.member.save();

				if ((Math.floor(0.1 * Math.sqrt(data.member.xp -= RandomXP)) < data.member.level)) {
					const levelMsg = data.guild.plugins.leveling.message || "<a:tada:819934065414242344> Congrats {author}, you're now at level **{level}**!";

					if (data.guild.plugins.leveling?.channel && message.guild.channels.cache.find(c => c.id === data.guild.plugins.leveling?.channel)) {
						const channel = message.guild.channels.cache.find(c => c.id === data.guild.plugins.leveling.channel);

						try {
							await channel.send(levelMsg.toString().replaceAll(`{author}`, message.author).replaceAll(`{level}`, bot.functions.formatNumber(data.member.level)));
						} catch (err) {
							await message.replyT("Uh oh! I don't have access to the channel you've setup for leveling messages. If you need help fixing this, you can always contact support. Support Server: https://discord.gg/PPtzT8Mu3h");
							await message.replyT(levelMsg.toString().replaceAll(`{author}`, message.author).replaceAll(`{level}`, bot.functions.formatNumber(data.member.level)));
						}
					} else {
						await message.replyT(levelMsg.toString().replaceAll(`{author}`, message.author).replaceAll(`{level}`, bot.functions.formatNumber(data.member.level)));
					}
				}
			}
		}

		// Check for a prefix
		const prefix = bot.functions.getPrefix(message, data);

		if (!prefix && message.mentions.has(bot.user)) return message.replyT("Hi! Please run `/help` to see what I can do. If you're trying to use SparkV's chatbot feature, please run `/chatbot start` to get started.");

		// If the user is part of the user blacklist, return.
		if (bot.config.blacklist.users[message.author.id]) return await message.replyT(`You have been blacklisted. Reason: ${bot.config.blacklist.users[message.author.id]}\n\nIf you think this ban wasn't correct, please contact support. (https://discord.gg/PPtzT8Mu3h)`);

		if (!prefix) return;

		// Command Handler
		const args = message.content.slice(prefix?.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();
		const commandfile = bot.commands.get(command) || bot.aliases.get(command);

		if (!commandfile) return;

		if (message.author.id !== bot.config.ownerID) return;

		try {
			await commandfile.run(bot, message, args, command, data);
		} catch (err) {
			const { tag, id } = message.author;
			sentry.configureScope(scope => {
				scope.setUser({
					username: tag,
					id
				});

				scope.setTag(`Command`, commandfile.settings.name);
				scope.setTag(`GuildType`, message?.channel?.type || "UNKNOWN");
			});

			bot.logger(err, "error");

			const ErrorEmbed = new Discord.MessageEmbed()
				.setAuthor({
					name: message.author.tag,
					iconURL: message.author.displayAvatarURL({ dynamic: true })
				})
				.setTitle("Uh oh!")
				.setDescription(`**An error occured while trying to run this command. Please contact support [here](https://discord.gg/PPtzT8Mu3h).**\n\n${err.message}`)
				.setColor("RED");

			await message.replyT({
				embeds: [ErrorEmbed],
			});
		}
	},
};
