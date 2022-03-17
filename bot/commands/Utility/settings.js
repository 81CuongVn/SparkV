const { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed, Options } = require("discord.js");

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
		const SelectMenu = new MessageSelectMenu()
			.setCustomId(`SelectMenu_${options.id}`)
			.setPlaceholder("Select an option.")

			.addOptions(options.dropdownItems);

		components.push(new MessageActionRow().addComponents(SelectMenu));
	}

	const channelMsg = await message.replyT({
		embeds: [requestMsg],
		components: components
	});

	if (options.dropdownItems) {
		const collector = await channelMsg.createMessageComponentCollector({
			max: 1,
			time: (options.time * 1000)
		});

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
					} catch (err) {
						// Do nothing. Most likely the message was deleted.
					}
				} catch (err) {
					const ErrorEmbed = new MessageEmbed()
						.setAuthor({
							name: interaction.user.tag,
							iconURL: interaction.user.displayAvatarURL({ dynamic: true })
						})
						.setTitle("Uh oh!")
						.setDescription(`**An error occured while trying to run this command. Please contact support [here](https://discord.gg/PPtzT8Mu3h).**\n\n${err}\n${err.message}`)
						.setColor("RED");

					return await message.reply({
						embeds: [ErrorEmbed]
					});
				}
			}
		});

		collector.on("end", async () => {
			try {
				await channelMsg?.edit({
					components: []
				});
			} catch (err) {
				// Do nothing. This is just to stop errors from going into the console. It's mostly for the case where the message is deleted.
			}
		});
	} else {
		await message.channel.awaitMessages({ filter: options.filter, max: 1, time: (options.time * 1000), errors: ["time"] }).then(async collected => {
			try {
				await options.handleData(collected.first(), requestMsg);

				await channelMsg.edit({
					embeds: [requestMsg],
				});

				try {
					setTimeout(() => {
						channelMsg.delete();
						collected.first().delete();
					}, 5 * 1000);
				} catch (err) {
					// Do nothing. Most likely the message was deleted.
				}
			} catch (err) {
				const ErrorEmbed = new MessageEmbed()
					.setAuthor({
						name: interaction.user.tag,
						iconURL: interaction.user.displayAvatarURL({ dynamic: true })
					})
					.setTitle("Uh oh!")
					.setDescription(`**An error occured while trying to run this command. Please contact support [here](https://discord.gg/PPtzT8Mu3h).**\n\n${err}\n${err.message}`)
					.setColor("RED");

				return await message.reply({
					embeds: [ErrorEmbed]
				});
			}
		}).catch(async collected => await message.replyT(`Canceled due to no valid response within ${options.time} seconds.`));
	}
}

async function execute(bot, message, args, command, data) {
	const loadingEmbed = new MessageEmbed()
		.setAuthor({
			name: message.user.tag,
			iconURL: message.user.displayAvatarURL({ dynamic: true })
		})
		.setTitle(`${bot.config.emojis.config} | Loading settings...`)
		.setDescription(`Please wait while I load the settings...`)
		.setFooter({
			text: bot.config.embed.footer,
			icon_url: bot.user.displayAvatarURL({ dynamic: true })
		})
		.setColor("GREY")
		.setTimestamp();

	const botMessage = await message.replyT({
		embeds: [loadingEmbed],
		ephemeral: true,
	});

	const ToggleButton = new MessageButton()
		.setLabel("Toggle")
		.setEmoji("⏺️")
		.setCustomId("toggle")
		.setStyle("DANGER");

	const settings = [
		{
			name: "Basic",
			emoji: bot.config.emojis.slash,
			emojiID: "939972618814128159",
			description: "Basic settings for the bot (prefix, language, chatbot, etc).",
			buttons: [
				{
					name: "Prefix",
					data: new MessageButton()
						.setLabel("Prefix")
						.setEmoji(bot.config.emojis.slash)
						.setCustomId("prefix")
						.setStyle("PRIMARY"),
					getData: () => data.guild.prefix,
					setData: async () => {
						await setNewData(message, {
							title: `${bot.config.emojis.config} | New Prefix`,
							description: "Please enter the new prefix for the bot.\n\n**Note:** The prefix cannot be longer than 5 characters.",
							color: "BLUE",
							time: 15,
							filter: async m => {
								if (m.author.id === m.client.user.id) return false;

								if (m.content) {
									if (m.content.length >= 5) {
										await m.replyT(`${bot.config.emojis.error} | The new prefix cannot be longer than 5 characters. Try again.`);

										return false;
									}

									return true;
								} else {
									await m.replyT(`${bot.config.emojis.error} | Dude... I need you to send a message. Not a picture.`);

									return false;
								}
							},
							handleData: async (collected, requestMsg) => {
								const newPrefix = collected.content.trim();

								requestMsg
									.setTitle(`${bot.config.emojis.config} | New Prefix Changed`)
									.setDescription(`Successfully changed prefix from **${data.guild.prefix}** to **${newPrefix}**.`);

								data.guild.prefix = newPrefix;
								data.guild.markModified("prefix");

								await data.guild.save();

								return true;
							}
						});
					},
				},
				// {
				// 	name: "Language",
				// 	data: new MessageButton()
				// 		.setLabel("Language")
				// 		.setEmoji(bot.config.emojis.slash)
				// 		.setCustomId("language")
				// 		.setDisabled(true)
				// 		.setStyle("PRIMARY"),
				// 	getData: () => data.guild.language,
				// 	setData: async () => {
				// 		await setNewData(message, {
				// 			title: `${bot.config.emojis.config} | New Language`,
				// 			id: "language",
				// 			description: "Please select the new language for the bot.",
				// 			dropdownItems: [
				// 				{
				// 					label: "English",
				// 					emoji: "🇺🇸",
				// 					value: "en"
				// 				},
				// 				{
				// 					label: "Spanish",
				// 					emoji: "🇪🇸",
				// 					value: "es"
				// 				},
				// 				{
				// 					label: "French",
				// 					emoji: "🇫🇷",
				// 					value: "fr"
				// 				}
				// 			],
				// 			color: "BLUE",
				// 			time: 15,
				// 			handleData: async (collected, requestMsg) => {
				// 				requestMsg
				// 					.setTitle(`${bot.config.emojis.config} | New Language Changed`)
				// 					.setDescription(`Successfully changed language from **${data.guild.language}** to **${collected}**.`);

				// 				data.guild.language = collected;
				// 				data.guild.markModified("language");

				// 				await data.guild.save();

				// 				return true;
				// 			}
				// 		});
				// 	},
				// },
				{
					name: "Chatbot",
					data: new MessageButton()
						.setLabel("Chatbot")
						.setEmoji(bot.config.emojis.slash)
						.setCustomId("chatbot")
						.setStyle("PRIMARY"),
					getData: () => data.guild.plugins.chatbot,
					setData: async () => {
						await setNewData(message, {
							title: `${bot.config.emojis.config} | New Chatbot Setting`,
							id: "chatbot",
							description: "Please select the new chatbot setting for the bot.",
							dropdownItems: [
								{
									label: "Disabled",
									emoji: bot.config.emojis.error,
									value: "false"
								},
								{
									label: "Mention",
									emoji: bot.config.emojis.mention,
									value: "mention"
								},
								{
									label: "Message",
									value: "message"
								}
							],
							color: "BLUE",
							time: 30,
							handleData: async (collected, requestMsg) => {
								requestMsg
									.setTitle(`${bot.config.emojis.config} | New Chatbot Setting Changed`)
									.setDescription(`Successfully changed Chatbot from **${data.guild.plugins.chatbot}** to **${collected}**.`);

								data.guild.plugins.chatbot = collected;
								data.guild.markModified("plugins.chatbot");

								await data.guild.save();

								return true;
							}
						});
					},
				},
			],
			stateDisabled: true,
		},
		{
			name: "Starboard",
			emoji: bot.config.emojis.star,
			emojiID: "948013324216434718",
			description: "The channel to setup the starboard in. Leave blank to disable.",
			buttons: [
				{
					name: "Toggle",
					data: ToggleButton,
					getData: () => data.guild.plugins?.starboard?.enabled || "false",
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
						if (data.guild.plugins?.starboard?.channel) {
							return `<#${data.guild.plugins.starboard.channel}>`;
						} else {
							return "None";
						}
					},
					setData: async () => {
						await setNewData(message, {
							title: `${bot.config.emojis.config} | Starboard Channel Setup`,
							description: "Please send a channel to setup the starboard in. You have 60 seconds to send a channel.",
							color: "GOLD",
							time: 60,
							filter: cFilter,
							handleData: async (collected, requestMsg) => {
								requestMsg
									.setTitle(`${bot.config.emojis.config} | Sarboard Channel Setup`)
									.setDescription(`Successfully setup starboard channel to ${collected.content}.`);

								data.guild.plugins.starboard.channel = collected.content.slice(2, -1);
								data.guild.markModified("plugins.starboard.channel");

								await data.guild.save();
							},
						});
					},
				},
				{
					name: "Emoji",
					data: new MessageButton()
						.setLabel("Emoji")
						.setEmoji(bot.config.emojis.star)
						.setCustomId("emoji")
						.setStyle("SECONDARY"),
					getData: () => data.guild.plugins?.starboard?.emoji || "⭐",
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
									.setDescription(`Successfully changed starboard emoji from ${data.guild.plugins.starboard.emoji} to ${newEmoji}.`);

								data.guild.plugins.starboard.emoji = newEmoji;
								data.guild.markModified("plugins.starboard.emoji");

								await data.guild.save();
							},
						});
					},
				},
				{
					name: "Minimum",
					data: new MessageButton()
						.setLabel("Minimum")
						.setEmoji(bot.config.emojis.numbers.two)
						.setCustomId("minimum")
						.setStyle("SECONDARY"),
					getData: () => data.guild.plugins?.starboard?.min || 2,
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
									.setDescription(`Successfully changed starboard minimum from ${data.guild.plugins.starboard.min} to ${min}.`);

								data.guild.plugins.starboard.min = parseInt(min);
								data.guild.markModified("plugins.starboard.min");

								await data.guild.save();
							},
						});
					},
				},
			],
			getState: () => data.guild.plugins?.starboard?.enabled,
			setState: async type => {
				if (type === "enable") {
					data.guild.plugins.starboard.enabled = "true";
				} else if (type === "disable") {
					data.guild.plugins.starboard.enabled = "false";
				}

				data.guild.markModified("plugins.starboard.enabled");

				await data.guild.save();
			}
		},
		{
			name: "Logging",
			emoji: bot.config.emojis.stats,
			emojiID: "947990408657518652",
			description: "Log actions in your server!",
			disabled: false,
			buttons: [
				{
					name: "Toggle",
					data: ToggleButton,
					getData: () => data.guild.plugins?.logging?.enabled || "false",
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
						if (data.guild.plugins?.logging?.channel) {
							return `<#${data.guild.plugins.logging.channel}>`;
						} else {
							return "None";
						}
					},
					setData: async () => {
						await setNewData(message, {
							title: `${bot.config.emojis.config} | Logging Channel Setup`,
							description: "Please send a channel to setup the logging system in. You have 60 seconds to send a channel.",
							color: "BLUE",
							time: 60,
							filter: cFilter,
							handleData: async (collected, requestMsg) => {
								requestMsg
									.setTitle(`${bot.config.emojis.config} | Logging Channel Setup`)
									.setDescription(`Successfully setup logging channel to ${collected.content}.`);

								data.guild.plugins.logging.channel = collected.content.slice(2, -1);
								data.guild.markModified("plugins.logging.channel");

								await data.guild.save();
							},
						});
					},
				},
			],
			getState: () => data.guild.plugins?.logging?.enabled,
			setState: async type => {
				if (type === "enable") {
					data.guild.plugins.logging.enabled = "true";
				} else if (type === "disable") {
					data.guild.plugins.logging.enabled = "false";
				}

				data.guild.markModified("plugins.logging.enabled");

				await data.guild.save();
			}
		}
	];

	async function refreshSetting(curSetting) {
		pages = [];
		createPages();

		const buttonsIncluded = [];

		curSetting.buttons.forEach(button => {
			if (button.name.toLowerCase() === "toggle") {
				const buttonData = button.data.setDisabled(false).setStyle(button.getData() === "true" ? "SUCCESS" : "DANGER");

				return buttonsIncluded.push(buttonData);
			}

			if (curSetting?.stateDisabled === true) return buttonsIncluded.push(button.data.setDisabled(false));

			if (curSetting?.getState() === "true") {
				buttonsIncluded.push(button.data.setDisabled(false));
			} else if (curSetting?.getState() === "false") {
				buttonsIncluded.push(button.data.setDisabled(true));
			}
		});

		buttons.push({
			type: 1,
			components: buttonsIncluded
		});

		buttons.push({
			type: 1,
			components: [BackButton, DashButton, SupportButton],
		});

		await botMessage.edit({
			embeds: [
				pages.find(page => page.author.name.includes(curSetting.name)),
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
		.setDescription(`**Personalize ${message.guild.name}**\n${settings.map(setting => {
			const state = setting?.stateDisabled === true ? bot.config.emojis.slash : (setting.getState() === "true" ? bot.config.emojis.success : bot.config.emojis.error);

			return `${state ? `${state} ` : ""}${setting.name}`;
		}).join("\n")}`)
		.setFooter({
			text: await message.translate(`Select a setting to edit below. • ${bot.config.embed.footer}`),
			iconURL: bot.user.displayAvatarURL({ dynamic: true })
		})
		.setColor(bot.config.embed.color)
		.setTimestamp();

	const BackButton = new MessageButton()
		.setLabel("⬅️ Back")
		.setCustomId("back")
		.setStyle("SECONDARY");

	const DashButton = new MessageButton()
		.setURL(`https://${process.env.BASEURL}/dashboard`)
		.setLabel("Dashboard")
		.setStyle("LINK");

	const SupportButton = new MessageButton()
		.setURL(bot.config.support.invite)
		.setLabel("Support")
		.setStyle("LINK");

	let pages = [];
	let buttons = [];
	let number = 0;
	let curSetting;

	function createPages() {
		settings.forEach(setting => {
			const settData = setting.buttons.map(button => `${button.getData() === "true" ? bot.config.emojis.success : (button.getData() === "false" ? bot.config.emojis.error : bot.config.emojis.slash)} ${button.name}: **${button.getData()}**`);
			const NewEmbed = new MessageEmbed()
				.setAuthor({
					name: `${setting.emojiID ? "" : setting.emoji}SparkV ${setting.name}`,
					iconURL: `https://cdn.discordapp.com/emojis/${setting.emojiID}.webp?size=56&quality=lossless`
				})
				.setDescription(`${setting.description}\n\n${settData.join("\n")}`)
				.setFooter({
					text: "SparkV - Making your Discord life easier!",
					iconURL: bot.user.displayAvatarURL({ dynamic: true })
				})
				.setColor(bot.config.embed.color)
				.setTimestamp();

			pages.push(NewEmbed);
		});
	}

	async function setupSettings() {
		settings.forEach(async setting => {
			const SettingButton = new MessageButton()
				.setLabel(setting.name)
				.setEmoji(setting.emoji)
				.setCustomId(setting.name)
				.setStyle("PRIMARY")
				.setDisabled(setting?.disabled ? setting.disabled : false);

			if (!buttons[number]) {
				buttons[number] = {
					type: 1,
					components: [SettingButton]
				};
			} else if (buttons[number].length === 6) {
				buttons.push({
					type: 1,
					components: [SettingButton]
				});

				number = 1;
			} else {
				buttons[number].components.push(SettingButton);
			}
		});
	}

	createPages();
	setupSettings();

	buttons.push({
		type: 1,
		components: [DashButton, SupportButton],
	});

	await bot.wait(750);

	await botMessage.edit({
		embeds: [Menu],
		components: buttons,
		fetchReply: true,
		ephemeral: true,
	});

	const collector = botMessage.createMessageComponentCollector({
		filter: async interaction => {
			if (!interaction.deferred) interaction.deferUpdate();

			if (interaction.user.id !== (message.user ? message.user : message.author).id) {
				await message.replyT({
					content: `Only ${message.author} can edit these settings!`,
					ephemeral: true
				});

				return false;
			}

			return true;
		}, time: 300 * 1000
	});

	collector.on("collect", async interaction => {
		try {
			buttons = [];

			if (interaction.customId === "back") {
				setupSettings();

				buttons.push({
					type: 1,
					components: [DashButton, SupportButton],
				});

				curSetting = null;

				return await botMessage.edit({
					embeds: [Menu],
					components: buttons,
					ephemeral: true
				});
			} else if (interaction.customId === "toggle" && curSetting && curSetting.buttons.find(button => button.name.toLowerCase() === "toggle")) {
				const newState = curSetting.getState() === "true" ? "false" : "true";

				if (newState === "true") {
					await curSetting.setState("enable");

					if (curSetting?.enabledText) message.replyT(curSetting.enabledText);

					curSetting.buttons.forEach(async button => {
						if (button?.required === true) {
							await button.setData();
						}
					});
				} else {
					await curSetting.setState("disable");

					if (curSetting?.disabledText) message.replyT(curSetting.disabledText);
				}

				refreshSetting(curSetting);
			} else if (curSetting && curSetting?.buttons.find(button => button.name.toLowerCase() === interaction.customId.toLowerCase())) {
				const button = curSetting.buttons.find(button => button.name.toLowerCase() === interaction.customId.toLowerCase());

				await button.setData();

				if (button.enabledText) message.replyT(button.enabledText);

				refreshSetting(curSetting);
			} else {
				curSetting = settings.find(setting => setting.name.toLowerCase() === interaction.customId.toLowerCase());

				if (curSetting) refreshSetting(curSetting);
			}
		} catch (error) {
			bot.logger(error, "error");

			const ErrorEmbed = new MessageEmbed()
				.setAuthor({
					name: interaction.user.tag,
					iconURL: interaction.user.displayAvatarURL({ dynamic: true })
				})
				.setTitle("Uh oh!")
				.setDescription(`**A critical error has occured with either with our database, or handling Discord API. Please contact support [here](https://discord.gg/PPtzT8Mu3h).**\n\n${error.message}`)
				.setColor("RED");

			try {
				return await botMessage.edit({
					embeds: [ErrorEmbed],
					ephemeral: true
				});
			} catch (err) {

			}
		}
	});

	collector.on("end", async () => {
		try {
			await botMessage?.edit({
				embeds: [
					Menu
						.setTitle(await message.translate("Config Command - Timed Out!"), bot.user.displayAvatarURL({ dynamic: true }))
						.setDescription(await message.translate("You have gone inactive! Please rerun command to use this command again."))
				],
				components: [],
				ephemeral: true
			});
		} catch (err) {
			// Do nothing. This is just to stop errors from going into the console. It's mostly for the case where the message is deleted.
		}
	});
}

module.exports = new cmd(execute, {
	description: "Personalize SparkV to suit your server!",
	dirname: __dirname,
	usage: "",
	aliases: [],
	perms: ["MANAGE_GUILD"],
	slash: true,
	slashOnly: true,
	cooldown: 30,
});
