const sentry = require("@sentry/node");
const Levels = require("discord-xp");
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

module.exports = {
	once: false,
	async execute(bot, message) {
		// If the application owner isn't ready yet, wait for it.
		if (!bot.application?.owner) await bot.application?.fetch();

		// If the channel is a partial, wait for the channel to fetch.
		if (message.channel?.partial) await message.channel.fetch();

		// If the message is a partial, wait for the message to fetch.
		if (message?.partial) await message.fetch();

		// If the message's author is a bot, return. This prevents SparkV from responding to himself.
		if (message.author.bot) return;

		// If the message is from a DM, return. This prevents SparkV from responding to DMs.
		if (message.channel.type === "dm") return;

		const botMember = await message.guild.members.fetch(bot.user.id);

		// If the bot cannot send messages, return.
		if (!botMember.permissionsIn(message.channel).has(Discord.Permissions.FLAGS.SEND_MESSAGES)) return;

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
				if (!message.channel.permissionsFor(message.member).has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)) {
					const ignoredWords = [`hello`];
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
						message.replyT(
							`🔨 | ${message.author}, please stop cursing. If you curse again, you'll be muted. | You have **${data.member.infractionsCount}** warning(s).`,
						);

						if (data.member.infractionsCount === 12) {
							await message.replyT(`You've been **BANNED** for passing **${data.member.infractionsCount}** warning(s).`);

							try {
								message.member.ban({
									reason:
										"Continued to break SparkV's auto mod rules after 12 warnings. The 3rd was a mute, the 6th was a kick from the server and now the 12th is being banned.",
								});
							} catch (err) {
								return await message.replyT("Failed to ban user. Make sure I have the correct permisions!");
							}
						}

						if (data.member.infractionsCount === 6) {
							message.member
								.send(`You've been **KICKED** for getting **${data.member.infractionsCount}** warning(s).`)
								.catch(err => { });
							await message.replyT(`You've been **KICKED** for getting **${data.member.infractionsCount}** warning(s).`);

							try {
								message.member.kick({
									reason:
										"Continued to curse after 6 warnings. The 3rd was a mute and now this punishment is a kick from the server. The next punishment, at 12 warnings, will be a ban.",
								});
							} catch (err) {
								return await message.replyT("Failed to kick user. Make sure I have the correct permisions!");
							}
						}

						if (data.member.infractionsCount === 3) {
							const mutedRole = message.guild.roles.cache.find(
								role => role.name.toLowerCase().includes("muted") || role.name.toLowerCase().includes("mute"),
							);

							if (!mutedRole) {
								await message.replyT("Unable to find the muted role.");
							} else {
								message.member.roles.add(mutedRole);

								setTimeout(() => {
									message.member.roles.remove(mutedRole);
								}, 300 * 1000);
							}

							await message.replyT(
								`You've been muted for getting **${data.member.infractionsCount}** warning(s). You'll be unmuted in 5 minutes.`,
							);
						}
					}
				}
			}

			// Check for links
			if (data.guild.plugins.automod.removeLinks === "true") {
				if (
					!message.channel.permissionsFor(message.member).has(Discord.Permissions.FLAGS.MANAGE_MESSAGES) &&
					!message.channel.permissionsFor(message.member).has(Discord.Permissions.FLAGS.ADMINISTRATOR) &&
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

					message.replyT(
						`🔨 | ${message.author}, you cannot send links! | You have **${data.member.infractionsCount}** warning(s).`,
					);

					if (data.member.infractionsCount === 12) {
						await message.replyT(`You've been **BANNED** for passing **${data.member.infractionsCount}** warning(s).`);

						try {
							message.member.ban({
								reason:
									"Continued to break SparkV's auto mod rules after 12 warnings. The 3rd was a mute, the 6th was a kick from the server and now the 12th is being banned.",
							});
						} catch (err) {
							return await message.replyT("Failed to ban user. Make sure I have the correct permisions!");
						}
					}

					if (data.member.infractionsCount === 6) {
						message.member
							.send(`You've been **KICKED** for getting **${data.member.infractionsCount}** warning(s).`)
							.catch(err => { });
						await message.replyT(`You've been **KICKED** for getting **${data.member.infractionsCount}** warning(s).`);

						try {
							message.member.kick({
								reason:
									"Continued to curse after 6 warnings. The 3rd was a mute and now this punishment is a kick from the server. The next punishment, at 12 warnings, will be a ban.",
							});
						} catch (err) {
							return await message.replyT("Failed to kick user. Make sure I have the correct permisions!");
						}
					}

					if (data.member.infractionsCount === 3) {
						const mutedRole = message.guild.roles.cache.find(
							role => role.name.toLowerCase().includes("muted") || role.name.toLowerCase().includes("mute"),
						);

						if (!mutedRole) {
							await message.replyT("Unable to find the muted role.");
						} else {
							message.member.roles.add(mutedRole);

							setTimeout(() => {
								message.member.roles.remove(mutedRole);
							}, 300 * 1000);
						}

						await message.replyT(
							`You've been muted for getting **${data.member.infractionsCount}** warning(s). You'll be unmuted in 5 minutes.`,
						);
					}
				}
			}

			// Check for spam
			if (data.guild.plugins.automod.removeDuplicateText === "true") {
				if (!message.channel.permissionsFor(message.member).has(Discord.Permissions.FLAGS.MANAGE_MESSAGES) || !message.channel.permissionsFor(message.member).has(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
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

						const matches = foundMatches.filter(msg => msg.sendTimestamp > Date.now() - 5500);

						if (matches.length >= 5) {
							++data.member.infractionsCount;
							data.member.infractions.push({
								type: "spam",
								date: Date.now(),
							});

							data.member.markModified("infractionsCount");
							data.member.markModified("infractions");
							await data.member.save();

							message.replyT(
								`🔨 | ${message.author}, please stop spamming. If you continue to spam, you'll be punished. | You have **${data.member.infractionsCount}** warning(s).`,
							);

							if (data.member.infractionsCount === 12) {
								deleteMessages(bot, matches);
								await message.replyT(`You've been **BANNED** for passing **${data.member.infractionsCount}** warning(s).`);

								try {
									message.member.ban({
										reason:
											"Continued to break SparkV's auto mod rules after 12 warnings. The 3rd was a mute, the 6th was a kick from the server and now the 12th is being banned.",
									});
								} catch (err) {
									return await message.replyT("Failed to ban user. Make sure I have the correct permisions!");
								}
							}

							if (data.member.infractionsCount === 6) {
								deleteMessages(bot, matches);
								message.member
									.send(`You've been **KICKED** for getting **${data.member.infractionsCount}** warning(s).`)
									.catch(err => { });
								await message.replyT(`You've been **KICKED** for getting **${data.member.infractionsCount}** warning(s).`);

								try {
									message.member.kick({
										reason:
											"Continued to spam after 6 warnings. The 3rd was a mute and now this punishment is a kick from the server. The next punishment, at 12 warnings, will be a ban.",
									});
								} catch (err) {
									return await message.replyT("Failed to kick user. Make sure I have the correct permisions!");
								}
							}

							if (data.member.infractionsCount === 3) {
								deleteMessages(bot, matches);
								const mutedRole = message.guild.roles.cache.find(
									role => role.name.toLowerCase().includes("muted") || role.name.toLowerCase().includes("mute"),
								);

								if (!mutedRole) {
									await message.replyT("Unable to find the muted role.");
								} else {
									message.member.roles.add(mutedRole);

									setTimeout(() => {
										message.member.roles.remove(mutedRole);
									}, 300 * 1000);
								}

								await message.replyT(`You've been muted for getting **${data.member.infractionsCount}** warning(s).`);
							}
						}
					}
				}
			}

			// Leveling!
			if (data.guild.plugins.leveling.enabled === "true") {
				/*
				Max & Min XP Config
				let MaxXP = data.guild.plugins.leveling.max;
				let MinXP = data.guild.plugins.leveling.min;

				if (isNaN(MaxXP)) MaxXP = 15;
				if (isNaN(MinXP)) MinXP = 5;
				*/

				const RandomXP = Math.floor(Math.random() * 15) + 5;
				const HasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, RandomXP);

				if (HasLeveledUp) {
					const User = await Levels.fetch(message.author.id, message.guild.id);
					const levelMsg = data.guild.plugins.leveling.message || "<a:tada:819934065414242344> Congrats {author}, you're now at level **{level}**!";

					if (parseInt(data.guild.plugins.leveling?.channel) && message.guild.channels.cache.find(c => c.id === parseInt(data.guild.plugins.leveling?.channel))) {
						const channel = message.guild.channels.cache.find(c => c.id === parseInt(data.guild.plugins.leveling.channel));

						await channel.send(levelMsg.toString().replaceAll(`{author}`, message.author).replaceAll(`{level}`, bot.functions.formatNumber(User.level)));
					} else {
						await message.replyT(levelMsg.toString().replaceAll(`{author}`, message.author).replaceAll(`{level}`, bot.functions.formatNumber(User.level)));
					}
				}
			}
		}

		// Check for a prefix
		const prefix = bot.functions.getPrefix(message, data);

		if (!prefix) {
			if (message.mentions.has(bot.user)) {
				if (data.guild.plugins.chatbot === "mention") {
					return chatbot(message, true);
				}
			} else if (data.guild.plugins.chatbot === "message") {
				return chatbot(message, false);
			}

			return;
		}

		// If the user is part of the user blacklist, return.
		if (bot.config.blacklist.users[message.author.id]) return await message.replyT(`You have been blacklisted. Reason: ${bot.config.blacklist.users[message.author.id]}\n\nIf you think this ban wasn't correct, please contact support. (https://discord.gg/PPtzT8Mu3h)`);

		// Command Handler
		const args = message.content.slice(prefix.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();
		const commandfile = bot.commands.get(command) || bot.aliases.get(command);

		if (!commandfile) return;

		if (!cooldowns[message.author.id]) cooldowns[message.author.id] = [];

		const userCooldown = cooldowns[message.author.id];

		const time = userCooldown[commandfile.settings.name] || 0;

		if (time && (time > Date.now())) {
			const cooldownEmbed = new Discord.MessageEmbed()
				.setTitle(`${bot.config.emojis.error} | Whoa there ${message.author.username}!`)
				.setDescription(`Please wait ${Math.ceil((time - Date.now()) / 1000)} more seconds to use that command again.`)
				.setThumbnail(message.author.avatarURL)
				.setColor(`#0099ff`)
				.setFooter({
					text: bot.config.embed.footer,
					iconURL: bot.user.displayAvatarURL()
				});

			return await message.replyT({
				embeds: [cooldownEmbed],
			});
		}

		cooldowns[message.author.id][commandfile.settings.name] = Date.now() + commandfile.settings.cooldown;

		if (commandfile.settings.enabled === false) return await message.replyT(`${bot.config.emojis.error} | This command is currently disabled! Please try again later.`);
		if (commandfile.settings.guildOnly && !message.guild) return await message.replyT("This command is guild only. Please join a server with SparkV in it or invite SparkV to your own server.",);
		if (commandfile.settings.ownerOnly && message.author.id !== bot.config.ownerID) return await message.replyT("This command is restricted. Only the owner (KingCh1ll) can use this command.");
		if (commandfile.settings.slashOnly) return await message.replyT("This command is restricted for slash commands only. Please use the command with a slash (`/`) in front of it.");

		try {
			await commandfile.run(bot, message, args, command, data).then(async () => {
				if (data.guild.autoRemoveCommands === true) message.delete().catch(() => { });

				bot.StatClient.postCommand(command, message.author.id);
			});
		} catch (err) {
			const { tag, id } = message.author;
			sentry.configureScope(scope => {
				scope.setUser({
					username: tag,
					id
				});

				scope.setTag(`Command`, commandfile.settings.name);
				scope.setTag(`GuildType`, message.channel.type);
			});

			bot.logger(err, "error");

			await message.replyT(
				`${bot.config.emojis.error} | Uh oh! Something went wrong handling that command. Please join my Support Server (^Invite), create a ticket and report the following error: ${err}. Sorry!`,
			);
		}
	},
};

async function chatbot(message, wasMentioned) {
	let SlicedMessage;

	if (message.content.slice(21) === "") {
		// If case the user replys to SparkV instead of mentioning him, or for some other silly reason.

		SlicedMessage = message.content;
	} else {
		SlicedMessage = message.content.slice(21);
	}

	try {
		await fetch.get(
			`http://api.brainshop.ai/get?bid=${encodeURIComponent(process.env.CHAT_BID)}&key=${encodeURIComponent(
				process.env.CHAT_KEY,
			)}&uid=${encodeURIComponent(message.author.id)}&msg=${encodeURIComponent(
				wasMentioned === true ? SlicedMessage : message,
			)}`,
		)
			.then(async response => {
				if (response?.data?.cnt) {
					const APIEmbed = new Discord.MessageEmbed()
						.setTitle(`SparkV`)
						.setDescription(response.data.cnt)
						.setFooter({
							text: `Never send personal information to SparkV. • ${message.client.config.embed.footer}`,
							iconURL: message.client.user.displayAvatarURL()
						})
						.setColor(message.client.config.embed.color);

					message.client.StatClient.postCommand(`ChatBot`, message.author.id);

					await message.replyT({
						embeds: [APIEmbed],
					});
				} else {
					return console.error(`Failed to get message from Chat bot. Response: ${response.data}`);
				}
			});
	} catch (err) {
		return console.error(`Failed to get message from Chat bot. ${err}`);
	}
}
