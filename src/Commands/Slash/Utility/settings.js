const { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed, Permissions } = require("discord.js");

const cmd = require("@structures/command");

const numFilter = async m => {
	if (m.author.id === m.client.user.id) return false;

	if (m.content) {
		if (isNaN(m.content) || parseInt(m.content) < 1) {
			await m.replyT(`${bot.config.emojis.error} | Please provide a valid __number__. Try again.`);
			return false;
		}

		return true;
	} else {
		await m.replyT("Please reply with a __number__. Not an image. Try again.");
		return false;
	}
};

async function setNewData(message, options) {
	const requestMsg = new MessageEmbed()
		.setAuthor({
			name: message.user.tag,
			iconURL: message.user.displayAvatarURL({ dynamic: true })
		})
		.setTitle(options.title)
		.setDescription(options.description)
		.setFooter({
			text: bot.config.embed.footer,
			icon_url: bot.user.displayAvatarURL({ dynamic: true })
		})
		.setColor(options.color);

	const components = [];
	if (options.dropdownItems) {
		components.push(
			new MessageActionRow().addComponents(
				new MessageSelectMenu()
					.setCustomId(`SelectMenu_${options.id}`)
					.setPlaceholder("Select an option.")
					.addOptions(options.dropdownItems)
			)
		);
	}

	const channelMsg = await message.replyT({
		embeds: [requestMsg],
		components: components
	});

	if (options.dropdownItems) {
		const collector = await channelMsg.createMessageComponentCollector({ max: 1, time: (options.time * 1000) });
		collector.on("collect", async interaction => {
			if (interaction.customId.split("_")[1] === options.id) {
				try {
					await options.handleData(interaction.values[0], requestMsg);
					await channelMsg.edit({
						embeds: [requestMsg],
						components: []
					});

					try {
						setTimeout(() => {
							channelMsg.delete();
						}, 5 * 1000);
					} catch (err) { }
				} catch (err) {
					const ErrorEmbed = new MessageEmbed()
						.setAuthor({
							name: interaction.user.tag,
							iconURL: interaction.user.displayAvatarURL({ dynamic: true })
						})
						.setDescription(`${bot.config.emojis.alert} | **Uh oh!**\nA critical error has occured with either with our database, or handling Discord API. Please contact support [here](https://discord.gg/PPtzT8Mu3h).**\n\n${error.message}`)
						.setColor("RED");

					try {
						return await message.replyT({
							embeds: [ErrorEmbed]
						});
					} catch (err) { }
				}
			}
		});

		collector.on("end", async () => {
			try {
				await channelMsg?.edit({
					components: []
				});
			} catch (err) { }
		});
	} else {
		await message.channel.awaitMessages({ filter: options.filter, max: 1, time: (options.time * 1000), errors: ["time"] }).then(async collected => {
			try {
				await options.handleData(collected.first(), requestMsg);
				await channelMsg.edit({
					embeds: [requestMsg]
				});

				try {
					setTimeout(() => {
						channelMsg.delete();
						collected.first().delete();
					}, 5 * 1000);
				} catch (err) { }
			} catch (err) {
				return await message.reply({
					embeds: [
						new MessageEmbed()
							.setAuthor({
								name: interaction.user.tag,
								iconURL: interaction.user.displayAvatarURL({ dynamic: true })
							})
							.setDescription(`${bot.config.emojis.alert} | **Uh oh!**\nA critical error has occured with either with our database, or handling Discord API. Please contact support [here](https://discord.gg/PPtzT8Mu3h).**\n\n${error.message}`)
							.setColor("RED")
					]
				});
			}
		}).catch(async collected => await message.replyT(`${bot.config.emojis.alert} | Canceled due to no valid response within ${options.time} seconds.`));
	}
}

async function execute(bot, message, args, command, data) {
	const botMessage = await message.replyT({
		embeds: [
			new MessageEmbed()
				.setAuthor({
					name: message.user.tag,
					iconURL: message.user.displayAvatarURL({ dynamic: true })
				})
				.setTitle(await message.translate(`${bot.config.emojis.config} | Loading settings...`))
				.setDescription(await message.translate(`Please wait while I load the settings...`))
				.setFooter({
					text: bot.config.embed.footer,
					icon_url: bot.user.displayAvatarURL({ dynamic: true })
				})
				.setColor(bot.config.embed.color)
				.setTimestamp()
		],
		ephemeral: true
	});

	const ToggleButton = new MessageButton()
		.setLabel("Toggle")
		.setEmoji("⏺️")
		.setCustomId("toggle")
		.setStyle("DANGER");

	const channelButton = new MessageButton()
		.setLabel(await message.translate("Channel"))
		.setEmoji(bot.config.emojis.channel)
		.setCustomId("channel")
		.setStyle("SECONDARY");

	const settings = [
		{
			name: await message.translate("Basic"),
			id: "basic",
			emoji: bot.config.emojis.slash,
			emojiID: "939972618814128159",
			description: await message.translate("Basic settings for the bot (prefix, language, chatbot, etc)."),
			buttons: [
				{
					name: await message.translate("Language"),
					data: new MessageButton()
						.setLabel(await message.translate("Language"))
						.setEmoji(bot.config.emojis.slash)
						.setCustomId("language")
						.setStyle("PRIMARY"),
					getData: () => data.guild.language,
					setData: async () => {
						await setNewData(message, {
							title: await message.translate(`${bot.config.emojis.config} | New Language`),
							id: "language",
							description: await message.translate("Please select the new language for the bot."),
							dropdownItems: [
								{
									label: await message.translate("English"),
									emoji: "🇺🇸",
									value: "en"
								},
								{
									label: await message.translate("Spanish"),
									emoji: "🇪🇸",
									value: "es"
								},
								{
									label: await message.translate("French"),
									emoji: "🇫🇷",
									value: "fr"
								},
								{
									label: await message.translate("German"),
									emoji: "🇩🇪",
									value: "de"
								},
								{
									label: await message.translate("Italian"),
									emoji: "🇮🇹",
									value: "it"
								},
								{
									label: await message.translate("Dutch"),
									emoji: "🇳🇱",
									value: "nl"
								},
								{
									label: await message.translate("Portuguese"),
									emoji: "🇵🇹",
									value: "pt"
								},
								{
									label: await message.translate("Russian"),
									emoji: "🇷🇺",
									value: "ru"
								}
							],
							color: "BLUE",
							time: 15,
							handleData: async (collected, requestMsg) => {
								requestMsg
									.setTitle(await message.translate(`${bot.config.emojis.config} | New Language Changed`))
									.setDescription(`${await message.translate("Successfully changed language from")} "**${data.guild.language}**" ${await message.translate("to")} **${collected}**.`);

								data.guild.language = collected;
								data.guild.markModified("language");

								await data.guild.save();

								return true;
							}
						});
					}
				}
			],
			stateDisabled: true
		},
		{
			name: await message.translate("Logging"),
			description: await message.translate("Log actions in your server!"),
			id: "logging",
			emoji: bot.config.emojis.stats,
			emojiID: "947990408657518652",
			category: true,
			categories: [
				{
					name: "General",
					description: "General log actions. (Message (Deleted/Edited), User (Warned/Kicked/Banned))",
					id: "general",
					emoji: bot.config.emojis.stats,
					emojiID: "947990408657518652",
					data: new MessageButton()
						.setLabel(await message.translate("general"))
						.setEmoji(bot.config.emojis.stats)
						.setCustomId("general")
						.setStyle("SECONDARY"),
					buttons: [
						{
							name: "Toggle",
							data: ToggleButton,
							getData: () => data.guild.logging?.enabled || "false"
						},
						{
							name: "Channel",
							required: true,
							data: channelButton,
							getData: () => {
								if (data.guild.logging?.channel) return `<#${data.guild.logging.channel}>`;
								else return "None";
							},
							setData: async () => {
								await setNewData(message, {
									title: `${bot.config.emojis.config} | Logging Channel Setup`,
									description: "Please send a channel to setup the logging system in. You have 60 seconds to send a channel.",
									color: "BLUE",
									time: 60,
									handleData: async (collected, requestMsg) => {
										if (!m?.mentions?.channels?.first()) {
											return requestMsg
												.setTitle(`${bot.config.emojis.config} | Logging Channel Setup`)
												.setDescription(`Setup failed because the input provided was not a channel.`)
												.setColor("RED");
										}

										requestMsg
											.setTitle(`${bot.config.emojis.config} | Logging Channel Setup`)
											.setDescription(`Successfully setup logging channel to ${collected.content}.`);

										data.guild.logging.channel = collected.content.slice(2, -1);
										data.guild.markModified("logging.channel");

										await data.guild.save();
									}
								});
							}
						}
					],
					getState: () => data.guild.logging?.enabled,
					setState: async type => {
						if (type === "enable") data.guild.logging.enabled = "true";
						else if (type === "disable") data.guild.logging.enabled = "false";

						data.guild.markModified("logging.enabled");

						await data.guild.save();
					}
				}
			],
			stateDisabled: true
		},
		{
			name: "Leveling",
			id: "leveling",
			emoji: bot.config.emojis.arrows.up,
			emojiID: "954930080436609055",
			description: "Allow users to level up in your server.",
			disabled: false,
			buttons: [
				{
					name: "Toggle",
					data: ToggleButton,
					getData: () => data.guild.leveling?.enabled || "false"
				},
				{
					name: "Message",
					data: new MessageButton()
						.setLabel("Message")
						.setEmoji(bot.config.emojis.message)
						.setCustomId("message")
						.setStyle("DANGER"),
					getData: () => {
						if (data.guild?.leveling?.message) return `${data.guild.leveling.message}`;
						else return "None";
					},
					setData: async () => {
						await setNewData(message, {
							title: `${bot.config.emojis.config} | Leveling Message Setup`,
							description: "Please send text that will be said when a user levels up. You have 60 seconds to send some text. Default: `<a:tada:819934065414242344> Congrats {author}, you're now at level **{level}**!`\n**Placeholders**\n{author} - The user who leveled up.\n{level} - The user's new level.",
							color: "BLUE",
							time: 60,
							filter: async m => {
								if (m.author.id === m.client.user.id) return false;

								if (m.content) {
									if (m.content.length >= 500) {
										await m.replyT(`${bot.config.emojis.error} | The new leveling message cannot be longer than 500 characters. Try again.`);
										return false;
									}

									return true;
								} else {
									await m.replyT("Dude... I need you to send a message. Not a picture.");
									return false;
								}
							},
							handleData: async (collected, requestMsg) => {
								requestMsg
									.setTitle(`${bot.config.emojis.config} | Leveling Message Setup`)
									.setDescription(`Successfully setup leveling message to ${collected.content}.`);

								data.guild.leveling.message = collected.content;
								data.guild.markModified("leveling.message");

								await data.guild.save();
							}
						});
					}
				},
				{
					name: "Channel",
					data: channelButton,
					getData: () => {
						if (data.guild.leveling?.channel !== null) return `<#${data.guild.leveling.channel}>`;
						else return "None";
					},
					setData: async () => {
						await setNewData(message, {
							title: `${bot.config.emojis.config} | Leveling Channel Setup`,
							description: "Please send a channel to revieve level up notifications in. You have 60 seconds to send a channel.",
							color: "BLUE",
							time: 60,
							handleData: async (collected, requestMsg) => {
								if (!m?.mentions?.channels?.first()) {
									return requestMsg
										.setTitle(`${bot.config.emojis.config} | Leveling Channel Setup`)
										.setDescription(`Setup failed because the imput provided was not a channel.`)
										.setColor("RED");
								}

								requestMsg
									.setTitle(`${bot.config.emojis.config} | Leveling Channel Setup`)
									.setDescription(`Successfully setup leveling channel to ${collected.content}.`);

								data.guild.leveling.channel = collected.content.slice(2, -1);
								data.guild.markModified("leveling.channel");

								await data.guild.save();
							}
						});
					}
				}
			],
			getState: () => data.guild.leveling?.enabled,
			setState: async type => {
				if (type === "enable") data.guild.leveling.enabled = "true";
				else if (type === "disable") data.guild.leveling.enabled = "false";

				data.guild.markModified("leveling.enabled");
				await data.guild.save();
			}
		},
		{
			name: await message.translate("Tickets"),
			id: "tickets",
			emoji: bot.config.emojis.ticket,
			emojiID: "955241708935864320",
			description: "Allow users to tap a button to get support. To use this feature, **you must have a ticket panel set up (/panel tickets).**",
			buttons: [
				{
					name: await message.translate("Category"),
					required: true,
					data: channelButton.setLabel(await message.translate("Category")).setCustomId("category"),
					getData: () => {
						if (data?.guild?.tickets?.category) return `<#${data.guild.tickets.category}>`;
						else return "None";
					},
					setData: async () => {
						await setNewData(message, {
							title: await message.translate(`${bot.config.emojis.config} | Tickets Category Setup`),
							description: await message.translate("Please send a category ID to setup the starboard in. **You can automaticly skip this step if you run the `/panel tickets` command. **You have 60 seconds to send a category ID."),
							color: "BLUE",
							time: 60,
							filter: async m => {
								if (m.author.id === m.client.user.id) return false;

								if (!m?.content) {
									m.replyT("Please send a valid category ID to setup the tickets system in.");
									return false;
								}

								if (m?.content.length > 24) {
									m.replyT("The category ID must be 24 characters or less.");
									return false;
								}

								if (!m.guild.channels.cache.has(m.content)) {
									m.replyT("That is not a valid channel ID!");
									return false;
								}

								return true;
							},
							handleData: async (collected, requestMsg) => {
								requestMsg
									.setTitle(await message.translate(`${bot.config.emojis.config} | Tickets Channel Setup`))
									.setDescription(await message.translate(`Successfully setup tickets channel to ${collected.content}.`));

								data.guild.tickets.category = collected.content;
								data.guild.markModified("tickets.category");

								await data.guild.save();
							}
						});
					}
				},
				{
					name: "Roles",
					required: true,
					data: new MessageButton()
						.setLabel("Support Roles")
						.setEmoji(bot.config.emojis.special)
						.setCustomId("roles")
						.setStyle("SECONDARY"),
					getData: () => {
						if (data.guild?.tickets?.roles) return data.guild?.tickets?.roles.map(r => `<@&${r}>`).join(", ");
						else return "None";
					},
					setData: async () => {
						await setNewData(message, {
							title: await message.translate(`${bot.config.emojis.config} | Support Roles Setup`),
							description: await message.translate("Please mention support role(s). Support roles are roles that will grant users access to see tickets. You have 60 seconds to send a channel."),
							color: "BLUE",
							time: 60,
							handleData: async (collected, requestMsg) => {
								if (!m?.mentions?.roles?.first()) {
									return requestMsg
										.setTitle(`${bot.config.emojis.config} | Support Roles Setup`)
										.setDescription(`Setup failed because the input provided was not a role.`)
										.setColor("RED");
								}

								const roles = [];
								collected.mentions.roles.forEach(r => roles.push(r.id));

								requestMsg
									.setTitle(`${bot.config.emojis.config} | Support Roles Setup`)
									.setDescription(`Successfully setup support roles to ${collected.content}.`);

								data.guild.tickets.roles = roles;
								data.guild.markModified("tickets.roles");

								await data.guild.save();
							}
						});
					}
				}
			],
			stateDisabled: true
		},
		{
			name: await message.translate("Moderate"),
			description: await message.translate("Take your server moderation to the next level!"),
			id: "moderate",
			emoji: bot.config.emojis.ban,
			emojiID: "966075832265220167",
			category: true,
			categories: [
				{
					name: await message.translate("AntiScam"),
					description: await message.translate("Take action against links that are known to be scams."),
					id: "antiscam",
					emoji: bot.config.emojis.warning,
					emojiID: "953769677534945360",
					data: new MessageButton()
						.setLabel(await message.translate("AntiScam"))
						.setEmoji(bot.config.emojis.warning)
						.setCustomId("antiscam")
						.setStyle("SECONDARY"),
					buttons: [
						{
							name: "Toggle",
							data: ToggleButton,
							getData: () => data.guild.antiScam?.enabled || "false"
						},
						{
							name: await message.translate("Actions"),
							required: true,
							data: new MessageButton()
								.setLabel(await message.translate("Actions"))
								.setEmoji(bot.config.emojis.ban)
								.setCustomId("actions")
								.setStyle("SECONDARY"),
							getData: () => data.guild?.antiScam?.action || "None",
							setData: async () => {
								await setNewData(message, {
									title: `${bot.config.emojis.config} | AntiScam Actions`,
									description: "Please select the actions to take when a user sends a scam link. You have 60 seconds.",
									id: "scamLinks",
									color: "YELLOW",
									dropdownItems: [
										{
											label: await message.translate("Timeout"),
											emoji: bot.config.emojis.timeout,
											value: "timeout"
										},
										{
											label: await message.translate("Kick"),
											emoji: bot.config.emojis.kick,
											value: "kick"
										},
										{
											label: await message.translate("Ban"),
											emoji: bot.config.emojis.ban,
											value: "ban"
										}
									],
									handleData: async (collected, requestMsg) => {
										requestMsg
											.setTitle(`${bot.config.emojis.config} | AntiScam Actions`)
											.setDescription(`${bot.config.emojis.success} | Successfully set actions to ${collected}.`)
											.setColor("GREEN");

										data.guild.antiScam.action = collected;
										data.guild.markModified("antiScam.action");

										await data.guild.save();
									}
								});
							}
						}
						// {
						// 	name: await message.translate("Custom Words"),
						// 	required: true,
						// 	data: new MessageButton()
						// 		.setLabel(await message.translate("Custom Words"))
						// 		.setEmoji(bot.config.emojis.ban)
						// 		.setCustomId("custom")
						// 		.setStyle("SECONDARY"),
						// 	getData: () => data.guild?.antiScam?.custom.map(link => `**${link}**`).join(", ") || "None",
						// 	setData: async () => {
						// 		await setNewData(message, {
						// 			title: `${bot.config.emojis.config} | AntiScam Custom Words`,
						// 			description: "Send words to blacklist in your server as scam links. **If you want to send multiple custom words at once, just seperate the words by adding a comma**. You have 60 seconds.",
						// 			id: "scamLinks",
						// 			color: "YELLOW",
						// 			dropdownItems: [
						// 				{
						// 					label: await message.translate("Timeout"),
						// 					emoji: bot.config.emojis.timeout,
						// 					value: "timeout"
						// 				},
						// 				{
						// 					label: await message.translate("Kick"),
						// 					emoji: bot.config.emojis.kick,
						// 					value: "kick"
						// 				},
						// 				{
						// 					label: await message.translate("Ban"),
						// 					emoji: bot.config.emojis.ban,
						// 					value: "ban"
						// 				}
						// 			],
						// 			handleData: async (collected, requestMsg) => {
						// 				requestMsg
						// 					.setTitle(`${bot.config.emojis.config} | AntiScam Actions`)
						// 					.setDescription(`${bot.config.emojis.success} | Successfully set actions to ${collected}.`)
						// 					.setColor("GREEN");

						// 				data.guild.antiScam.action = collected;
						// 				data.guild.markModified("antiScam.action");

						// 				await data.guild.save();
						// 			}
						// 		});
						// 	}
						// }
					],
					getState: () => data.guild.antiScam?.enabled,
					setState: async type => {
						if (type === "enable") data.guild.antiScam.enabled = "true";
						else if (type === "disable") data.guild.antiScam.enabled = "false";

						data.guild.markModified("antiScam.enabled");

						await data.guild.save();
					}
				},
				{
					name: await message.translate("AntiSpam"),
					description: await message.translate("Take action against spam in your Discord server."),
					id: "antispam",
					emoji: bot.config.emojis.message,
					emojiID: "966496523955339264",
					data: new MessageButton()
						.setLabel(await message.translate("AntiSpam"))
						.setEmoji(bot.config.emojis.message)
						.setCustomId("antispam")
						.setStyle("SECONDARY"),
					buttons: [
						{
							name: "Toggle",
							data: ToggleButton,
							getData: () => data.guild.antiSpam?.enabled || "false"
						},
						{
							name: await message.translate("Actions"),
							required: true,
							data: new MessageButton()
								.setLabel(await message.translate("Actions"))
								.setEmoji(bot.config.emojis.ban)
								.setCustomId("actions")
								.setStyle("SECONDARY"),
							getData: () => data.guild?.antiSpam?.action || "None",
							setData: async () => {
								await setNewData(message, {
									title: `${bot.config.emojis.config} | AntiSpam Actions`,
									description: "Please select the actions to take when a user spams. You have 60 seconds.",
									id: "antiSpam",
									color: "YELLOW",
									dropdownItems: [
										{
											label: await message.translate("Timeout"),
											emoji: bot.config.emojis.timeout,
											value: "timeout"
										},
										{
											label: await message.translate("Kick"),
											emoji: bot.config.emojis.kick,
											value: "kick"
										},
										{
											label: await message.translate("Ban"),
											emoji: bot.config.emojis.ban,
											value: "ban"
										}
									],
									handleData: async (collected, requestMsg) => {
										requestMsg
											.setTitle(`${bot.config.emojis.config} | AntiSpam Actions`)
											.setDescription(`${bot.config.emojis.success} | Successfully set actions to ${collected}.`)
											.setColor("GREEN");

										data.guild.antiSpam.action = collected;
										data.guild.markModified("antiSpam.action");

										await data.guild.save();
									}
								});
							}
						}
					],
					getState: () => data.guild.antiSpam?.enabled,
					setState: async type => {
						if (type === "enable") data.guild.antiSpam.enabled = "true";
						else if (type === "disable") data.guild.antiSpam.enabled = "false";

						data.guild.markModified("antiSpam.enabled");

						await data.guild.save();
					}
				}
			],
			stateDisabled: true
		},
		{
			name: "Starboard",
			id: "starboard",
			emoji: bot.config.emojis.star,
			emojiID: "948013324216434718",
			description: "The channel to setup the starboard in. Leave blank to disable.",
			buttons: [
				{
					name: "Toggle",
					data: ToggleButton,
					getData: () => data.guild.starboard?.enabled || "false"
				},
				{
					name: "Channel",
					required: true,
					enabledText: "Successfully setup channel!",
					data: new MessageButton()
						.setLabel("Channel")
						.setEmoji(bot.config.emojis.channel)
						.setCustomId("channel")
						.setStyle("SECONDARY"),
					getData: () => {
						if (data.guild.starboard?.channel) return `<#${data.guild.starboard.channel}>`;
						else return "None";
					},
					setData: async () => {
						await setNewData(message, {
							title: `${bot.config.emojis.config} | Starboard Channel Setup`,
							description: "Please send a channel to setup the starboard in. You have 60 seconds to send a channel.",
							color: "GOLD",
							time: 60,
							handleData: async (collected, requestMsg) => {
								if (!m?.mentions?.channels?.first()) {
									return requestMsg
										.setTitle(`${bot.config.emojis.config} | Starboard Channel Setup`)
										.setDescription(`Setup failed because the input provided was not a channel.`)
										.setColor("RED");
								}

								requestMsg
									.setTitle(`${bot.config.emojis.config} | Starboard Channel Setup`)
									.setDescription(`Successfully setup starboard channel to ${collected.content}.`);

								data.guild.starboard.channel = collected.content.slice(2, -1);
								data.guild.markModified("starboard.channel");

								await data.guild.save();
							}
						});
					}
				},
				{
					name: "Emoji",
					data: new MessageButton()
						.setLabel("Emoji")
						.setEmoji(bot.config.emojis.star)
						.setCustomId("emoji")
						.setStyle("SECONDARY"),
					getData: () => data.guild.starboard?.emoji || "⭐",
					setData: async () => {
						await setNewData(message, {
							title: `${bot.config.emojis.config} | Changing Starboard Emoji`,
							description: "Please send an emoji to change the default starboard emoji to a new one. Keep in mine, users will be no longer able to react with a star to put on the starboard, and will have to use this new emoji for it. You have 30 seconds to send an emoji.",
							color: "GOLD",
							time: 30,
							filter: async m => {
								if (m.author.id === m.client.user.id) return false;

								if (m.content) {
									if (m.content.length >= 100) {
										await m.replyT(`${bot.config.emojis.error} | The new emoji cannot be longer than 100 characters. If it was any higher, it wouldn't be an emoji. Try again.`);
										return false;
									}

									return true;
								} else {
									await m.replyT("Dude... I need you to send a emoji. Not a picture.");
									return false;
								}
							},
							handleData: async (collected, requestMsg) => {
								const newEmoji = collected.content;

								requestMsg
									.setTitle(`${bot.config.emojis.config} | Changing Starboard Emoji`)
									.setDescription(`Successfully changed starboard emoji from ${data.guild.starboard.emoji} to ${newEmoji}.`);

								data.guild.starboard.emoji = newEmoji;
								data.guild.markModified("starboard.emoji");

								await data.guild.save();
							}
						});
					}
				},
				{
					name: "Minimum",
					data: new MessageButton()
						.setLabel("Minimum")
						.setEmoji(bot.config.emojis.numbers.two)
						.setCustomId("minimum")
						.setStyle("SECONDARY"),
					getData: () => data.guild.starboard?.min || 2,
					setData: async () => {
						await setNewData(message, {
							title: `${bot.config.emojis.config} | Changing Starboard Minimum`,
							description: "Please send a number to change the minimum amount of stars required to create a star message. You have 15 seconds to send a number.",
							color: "GOLD",
							time: 15,
							filter: numFilter,
							handleData: async (collected, requestMsg) => {
								const min = collected.content.trim();

								requestMsg
									.setTitle(`${bot.config.emojis.config} | Changing Starboard Minimum`)
									.setDescription(`Successfully changed starboard minimum from ${data.guild.starboard.min} to ${min}.`);

								data.guild.starboard.min = parseInt(min);
								data.guild.markModified("starboard.min");

								await data.guild.save();
							}
						});
					}
				}
			],
			getState: () => data.guild.starboard?.enabled,
			setState: async type => {
				if (type === "enable") data.guild.starboard.enabled = "true";
				else if (type === "disable") data.guild.starboard.enabled = "false";

				data.guild.markModified("starboard.enabled");

				await data.guild.save();
			}
		}
	];

	async function refreshSetting(curSetting) {
		buttons = [];
		pages = [];
		await createPages();

		function handleButton(button) {
			if (button.name.toLowerCase() === "toggle") return buttonsIncluded.push(button?.data?.setDisabled(false).setStyle(button.getData() === "true" ? "SUCCESS" : "DANGER"));
			if (curSetting?.stateDisabled === true) return buttonsIncluded.push(button?.data?.setDisabled(false));
			if (curSetting?.getState() === "true") buttonsIncluded.push(button?.data?.setDisabled(false));
			else if (curSetting?.getState() === "false") buttonsIncluded.push(button?.data?.setDisabled(true));
		}

		const buttonsIncluded = [];
		curSetting?.category === true ? curSetting.categories.forEach(button => handleButton(button)) : curSetting?.buttons?.forEach(button => handleButton(button));

		buttons.push({
			type: 1,
			components: buttonsIncluded
		});

		buttons.push({
			type: 1,
			components: [BackButton, WebsiteButton, SupportButton]
		});

		await botMessage.edit({
			embeds: [
				pages.filter(page => page.author.name.toLowerCase().includes(curSetting.name.toLowerCase()))[0]
			],
			components: buttons,
			ephemeral: true
		});
	}

	const Menu = new MessageEmbed()
		.setAuthor({
			name: "SparkV Settings Menu",
			iconURL: bot.user.displayAvatarURL({ dynamic: true })
		})
		.setDescription(`**Personalize ${message.guild.name}**\nSelect a setting using the buttons below.\n${settings.map(setting => {
			const state = setting?.stateDisabled === true ? bot.config.emojis.slash : (setting.getState() === "true" ? bot.config.emojis.success : bot.config.emojis.error);

			return `${state ? `${state} ` : ""}${setting.name}`;
		}).join("\n")}`)
		.setFooter({
			text: await message.translate(`Select a setting to edit below. • ${bot.config.embed.footer}`),
			iconURL: bot.user.displayAvatarURL({ dynamic: true })
		})
		.setColor(bot.config.embed.color)
		.setTimestamp();

	const ExitButton = new MessageButton()
		.setLabel("Exit")
		.setEmoji(bot.config.emojis.leave)
		.setCustomId("exit")
		.setStyle("DANGER");

	const BackButton = new MessageButton()
		.setLabel("Back")
		.setEmoji(bot.config.emojis.arrows.left)
		.setCustomId("back")
		.setStyle("SECONDARY");

	const WebsiteButton = new MessageButton()
		.setURL(`https://${process.env.BASEURL}/`)
		.setEmoji(bot.config.emojis.globe)
		.setLabel("Website")
		.setStyle("LINK");

	const SupportButton = new MessageButton()
		.setURL(bot.config.support.invite)
		.setLabel("Support")
		.setStyle("LINK");

	let pages = [];
	let curSetting;

	async function createPages() {
		settings.forEach(setting => {
			const embed = new MessageEmbed()
				.setAuthor({
					name: `${setting.emojiID ? "" : setting.emoji}SparkV ${setting.name}`,
					iconURL: `https://cdn.discordapp.com/emojis/${setting.emojiID}.webp?size=56&quality=lossless`
				})
				.setDescription(`${setting.description}\n\n${(setting?.category === true ? setting.categories.map(cat => `${cat.name}`) : setting.buttons.map(button => `${button.getData() === "true" ? bot.config.emojis.success : (button.getData() === "false" ? bot.config.emojis.error : bot.config.emojis.slash)} ${button.name}: **${button.getData()}**`)).join("\n")}`)
				.setColor(bot.config.embed.color)
				.setTimestamp();

			pages.push(embed);

			if (setting.category === true) {
				setting.categories.forEach(category => {
					const catEmbed = new MessageEmbed()
						.setAuthor({
							name: `${category.emojiID ? "" : category.emoji}SparkV ${category.name}`,
							iconURL: `https://cdn.discordapp.com/emojis/${category.emojiID}.webp?size=56&quality=lossless`
						})
						.setDescription(`${category.description}\n\n${category.buttons.map(button => `${button.getData() === "true" ? bot.config.emojis.success : (button.getData() === "false" ? bot.config.emojis.error : bot.config.emojis.slash)} ${button.name}: **${button.getData()}**`).join("\n")}`)
						.setColor(bot.config.embed.color)
						.setTimestamp();

					pages.push(catEmbed);
				});
			}
		});
	}

	let buttons = [];
	let rows = 0;
	async function setupSettings() {
		settings.forEach(async setting => {
			const SettingButton = new MessageButton()
				.setLabel(setting.name)
				.setEmoji(setting.emoji)
				.setCustomId(setting.id)
				.setStyle("PRIMARY")
				.setDisabled(setting?.disabled ? setting.disabled : false);

			if (!buttons[rows]) {
				buttons[rows] = {
					type: 1,
					components: [SettingButton]
				};
			} else if (buttons[rows]?.components?.length >= 5) {
				buttons.push({
					type: 1,
					components: [SettingButton]
				});

				++rows;
			} else {
				buttons[rows].components.push(SettingButton);
			}
		});
	}

	await createPages();
	await setupSettings();

	buttons.push({
		type: 1,
		components: [ExitButton, WebsiteButton, SupportButton]
	});

	await bot.wait(750);

	if (!message.channel.permissionsFor(message.user).has("MANAGE_GUILD")) {
		if (bot.config.owners.includes(message?.user?.id)) {
			await botMessage.edit({
				embeds: [
					new MessageEmbed()
						.setAuthor({
							name: message.user.tag,
							iconURL: message.user.displayAvatarURL({ dynamic: true })
						})
						.setDescription(`${bot.config.emojis.alert} | You do not have permission (MANAGE_GUILD) to manage this guild's settings for SparkV. However, you're my owner so you can have access. Please select below \`yes\` or \`no\` to continue.`)
						.setColor("RED")
				],
				components: [
					{
						type: 1,
						components: [
							new MessageButton()
								.setEmoji(bot.config.emojis.success)
								.setLabel("Yes")
								.setStyle("SUCCESS")
								.setCustomId("yes"),
							new MessageButton()
								.setEmoji(bot.config.emojis.error)
								.setLabel("No")
								.setStyle("DANGER")
								.setCustomId("no")
						]
					},
					{
						type: 1,
						components: [WebsiteButton, SupportButton]
					}
				],
				fetchReply: true,
				ephemeral: true
			});

			const collector = botMessage.createMessageComponentCollector({
				filter: async interaction => {
					if (interaction.user.id !== message.user.id) {
						await interaction.reply({
							content: `Only ${message.user} can edit these settings!`,
							ephemeral: true
						});
					}

					return interaction.user.id === message.user.id;
				}, time: 300 * 1000, max: 1
			});

			collector.on("collect", async interaction => {
				if (!interaction.deferred) interaction.deferUpdate().catch(err => { });
				if (interaction.customId === "no") {
					await botMessage.edit({
						embeds: [
							new MessageEmbed()
								.setAuthor({
									name: message.user.tag,
									iconURL: message.user.displayAvatarURL({ dynamic: true })
								})
								.setDescription(`${bot.config.emojis.alert} | You have chosen to not manage this guild's settings for SparkV.`)
								.setColor("RED")
						],
						components: [
							{
								type: 1,
								components: [WebsiteButton, SupportButton]
							}
						],
						fetchReply: true,
						ephemeral: true
					});
				} else {
					await botMessage.edit({
						embeds: [Menu],
						components: buttons,
						fetchReply: true,
						ephemeral: true
					});
				}
			});
		} else {
			return await botMessage.edit({
				embeds: [
					new MessageEmbed()
						.setAuthor({
							name: message.user.tag,
							iconURL: message.user.displayAvatarURL({ dynamic: true })
						})
						.setDescription(`${bot.config.emojis.alert} | You do not have permission (MANAGE_GUILD) to manage this server's settings for SparkV. Please contact the server owner to request this permission.`)
						.setColor("RED")
				],
				fetchReply: true,
				ephemeral: true
			});
		}
	} else {
		await botMessage.edit({
			embeds: [Menu],
			components: buttons,
			fetchReply: true,
			ephemeral: true
		});
	}

	const collector = botMessage.createMessageComponentCollector({
		filter: async interaction => {
			if (interaction.user.id !== message.user.id) {
				await interaction.reply({
					content: `Only ${message.user} can edit these settings!`,
					ephemeral: true
				});
			}

			return interaction.user.id === message.user.id;
		}, time: 300 * 1000
	});

	const exitEmbed = new MessageEmbed()
		.setAuthor({
			name: message.user.tag,
			iconURL: message.user.displayAvatarURL({ dynamic: true })
		})
		.setDescription(`${bot.config.emojis.alert} | Saved changes and exited the settings menu.`)
		.setColor(bot.config.embed.color);

	collector.on("collect", async interaction => {
		if (!interaction.deferred) interaction.deferUpdate().catch(err => { });

		try {
			buttons = [];

			switch (interaction.customId) {
				case "back":
					setupSettings();

					buttons.push({
						type: 1,
						components: [ExitButton, WebsiteButton, SupportButton]
					});

					buttons = buttons.filter(Boolean);
					curSetting = null;

					return await botMessage.edit({
						embeds: [Menu],
						components: buttons ?? [],
						ephemeral: true
					});
				case "exit": return await collector.stop();
				case interaction?.customId === "toggle" && curSetting && curSetting?.buttons?.find(button => button?.data?.customId?.toLowerCase() === "toggle"):
					if ((curSetting.getState() === "true" ? "false" : "true") === "true") {
						await curSetting.setState("enable");
						curSetting?.buttons?.forEach(async button => button?.required === true ? await button.setData() : null);
					} else {
						await curSetting.setState("disable");
					}

					refreshSetting(curSetting);
					break;
				case curSetting && curSetting?.buttons?.find(button => button?.data?.customId?.toLowerCase() === interaction?.customId?.toLowerCase()):
					await curSetting?.buttons?.find(button => button.data.customId.toLowerCase() === interaction.customId.toLowerCase()).setData();
					refreshSetting(curSetting);
					break;
				default:
					let foundSetting;
					settings.forEach(setting => {
						switch (setting?.category === true) {
							case ((setting.id.toLowerCase() === interaction.customId.toLowerCase()) === true):
								foundSetting = setting;
								break;
							case (setting?.categories.find(cat => cat.id.toLowerCase() === interaction.customId.toLowerCase())): foundSetting = setting?.categories.find(cat => cat.id.toLowerCase() === interaction.customId.toLowerCase());
						}

						if ((setting.id.toLowerCase() === interaction.customId.toLowerCase()) === true) foundSetting = setting;
					});
					console.log(foundSetting);

					curSetting = foundSetting;
					curSetting && refreshSetting(curSetting);
					break;
			}
		} catch (error) {
			bot.logger(error, "error");

			const ErrorEmbed = new MessageEmbed()
				.setAuthor({
					name: interaction.user.tag,
					iconURL: interaction.user.displayAvatarURL({ dynamic: true })
				})
				.setDescription(`${bot.config.emojis.alert} | **Uh oh!**\nA critical error has occured with either with our database, or handling Discord API. Please contact support [here](https://discord.gg/PPtzT8Mu3h).**\n\n${error.message}`)
				.setColor("RED");

			try {
				return await botMessage.edit({
					embeds: [ErrorEmbed],
					ephemeral: true
				});
			} catch (err) { }
		}
	});

	collector.on("end", async interaction => {
		try {
			return await botMessage.edit({
				embeds: [exitEmbed],
				components: []
			});
		} catch (err) { }
	});
}

module.exports = new cmd(execute, {
	description: "Personalize SparkV to suit your server!",
	dirname: __dirname,
	usage: "",
	aliases: [],
	perms: [],
	slash: true,
	slashOnly: true,
	cooldown: 30
});
