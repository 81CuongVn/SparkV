import Discord, { ButtonBuilder, EmbedBuilder, ButtonInteraction, ButtonStyle, Colors } from "discord.js";

import cmd from "../../../Structures/command";

async function execute(bot: any, message?: any, args?: string[], command?: any, data?: any) {
	/* -------------------------------------------------- SEND MESSAGE --------------------------------------------------*/
	const botMessage = await message.replyT({
		embeds: [{
			author: {
				name: message.user.tag,
				icon_url: message.user.displayAvatarURL()
			},
			title: await message.translate(`${bot.config.emojis.config} | Loading settings...`),
			description: await message.translate(`Please wait while I load the settings...`),
			timestamp: new Date(),
			color: Colors.Blue
		}],
		ephemeral: true
	});

	/* -------------------------------------------------- SET DATA --------------------------------------------------*/
	async function setNewData(message?: any, options?: any) {
		const requestMsg = new EmbedBuilder()
			.setAuthor({
				name: message.user.tag,
				iconURL: message.user.displayAvatarURL()
			})
			.setTitle(options.title)
			.setDescription(options.description)
			.setColor(options?.color ? Colors[options?.color as keyof typeof Colors] : Colors.Blue)
			.setFooter({
				text: bot.config.embed.footer,
				iconURL: bot.user.displayAvatarURL()
			})

		const components = [];
		if (options.dropdownItems) components.push({
			type: 1,
			components: [{
				type: 3,
				customId: `SelectMenu_${options.id}`,
				placeholder: "Select an option.",
				options: options.dropdownItems,
				disabled: false
			} as {
				type: number,
				customId: string,
				placeholder: string,
				options: any[],
				disabled: boolean
			}]
		});

		const channelMsg = await message.replyT({
			embeds: [requestMsg],
			components: components
		});

		if (options.dropdownItems) {
			const collector = await channelMsg.createMessageComponentCollector({ max: 1, time: (options.time * 1000) });
			collector.on("collect", async (interaction: any) => {
				if (interaction.customId.split("_")[1] === options.id) {
					try {
						await options.handleData(interaction.values[0], requestMsg);
						await channelMsg.edit({ embeds: [requestMsg], components: [] });

						try { setTimeout(() => channelMsg.delete(), 5 * 1000); } catch (err) { }
					} catch (err: any) {
						bot.logger(err, "error", { data: err, interaction });

						try {
							return await message.replyT({
								embeds: [{
									author: {
										name: interaction.user.tag,
										iconURL: interaction.user.displayAvatarURL()
									},
									description: `${bot.config.emojis.alert} | **Uh oh!**\nA critical error has occured with either with our database, or handling Discord API. Please contact support [here](https://discord.gg/PPtzT8Mu3h).\n\n${err?.message ?? err}`,
									color: Colors.Red
								}]
							});
						} catch (err: any) { }
					}
				}
			});

			collector.on("end", async () => { try { await channelMsg?.edit({ components: [] }); } catch (err: any) { } });
		} else {
			await message.channel.awaitMessages({ filter: (m: any) => !m.author.id === m.client.user.id, max: 1, time: (options.time * 1000), errors: ["time"] }).then(async (collected: any) => {
				try {
					await options.handleData(collected.first(), requestMsg);
					await channelMsg.edit({ embeds: [requestMsg] });
					try { setTimeout(() => { channelMsg.delete(); collected.first().delete(); }, 5 * 1000); } catch (err) { }
				} catch (err: any) {
					bot.logger(err, "error", { data: err });

					return await message.reply({
						embeds: [{
							author: { name: message.user.tag, iconURL: message.user.displayAvatarURL() },
							description: `${bot.config.emojis.alert} | **Uh oh!**\nA critical error has occured with either with our database, or handling Discord API. Please contact support [here](https://discord.gg/PPtzT8Mu3h).\n\n${err?.message ?? err}`,
							color: Colors.Red
						}]
					});
				}
			}).catch(async () => await message.replyT(`${bot.config.emojis.alert} | Canceled due to no valid response within ${options.time} seconds.`));
		}
	}

	/* -------------------------------------------------- SETTINGS --------------------------------------------------*/
	const ToggleButton = new ButtonBuilder().setLabel("Toggle").setEmoji("⏺️").setCustomId("toggle").setStyle(ButtonStyle.Danger);
	const channelButton = new ButtonBuilder().setLabel(await message.translate("Channel")).setEmoji(bot.config.emojis.channel)
		.setCustomId("channel").setStyle(ButtonStyle.Secondary);

	let settings: any[] = [];
	if (data.options.getString("type") === "user") {
		settings = [{
			name: await message.translate("Afk"),
			id: "afk",
			emoji: bot.config.emojis.slash,
			emojiID: "939972618814128159",
			description: await message.translate("Set yourself as AFK. Setting yourself as AFK will notify anybody who is trying to mention you that you're AFK."),
			buttons: [{
				name: "Toggle",
				data: ToggleButton,
				getData: () => data.user?.afk?.enabled ?? "false",
			}, {
				name: await message.translate("Reason"),
				data: new ButtonBuilder().setLabel(await message.translate("Reason")).setEmoji(bot.config.emojis.slash).setCustomId("reason").setStyle(ButtonStyle.Primary),
				getData: () => data.user?.afk?.reason ?? "No supplied reason.",
				setData: async () => {
					await setNewData(message, {
						title: `${bot.config.emojis.config} | AFK Reason Setup`,
						description: "Please send the reason for being afk. You have 60 seconds to send a message.",
						color: "Blue",
						time: 60,
						handleData: async (collected: any, requestMsg?: any) => {
							requestMsg
								.setTitle(`${bot.config.emojis.config} | AFK Reason Setup`)
								.setDescription(`You are now afk with the reason: ${collected.content}.`);

							data.user.afk.reason = collected.content;
							data.user.markModified("afk.reason");
							await data.user.save();
						}
					});
				}
			}],
			getState: () => data.user?.afk?.enabled ?? "false",
			setState: async (type: any) => {
				switch (type) {
					case "enable": { data.user.afk.enabled = "true"; break; }
					case "disable": { data.user.afk.enabled = "false"; }
				}
				data.user.markModified("afk.enabled");
				await data.user.save();
			}
		}, {
			name: await message.translate("Vote Reminder"),
			id: "vote_reminder",
			emoji: bot.config.emojis.stats,
			emojiID: "947990408657518652",
			description: await message.translate("Want to be reminded to vote for SparkV? We'll give you ⏣25,000 coins per vote."),
			buttons: [{
				name: "Toggle",
				data: ToggleButton,
				getData: () => data?.user?.votes?.remind ?? "false",
			}],
			getState: () => data?.user?.votes?.remind ?? "false",
			setState: async (type: any) => {
				switch (type) {
					case "enable": { data.user.votes.remind = "true"; break; }
					case "disable": { data.user.votes.remind = "false"; }
				}
				data.user.markModified("votes.remind");
				await data.user.save();
			}
		}];
	} else if (data.options.getString("type") === "server") {
		settings = [{
			name: await message.translate("Basic"),
			id: "basic",
			emoji: bot.config.emojis.slash,
			emojiID: "939972618814128159",
			description: await message.translate("Basic settings for the bot (prefix, language, chatbot, etc)."),
			buttons: [{
				name: await message.translate("Language"),
				data: new ButtonBuilder().setLabel(await message.translate("Language")).setEmoji(bot.config.emojis.slash).setCustomId("language").setStyle(ButtonStyle.Primary),
				getData: () => data.guild.language,
				setData: async () => {
					await setNewData(message, {
						title: await message.translate(`${bot.config.emojis.config} | New Language`),
						id: "language",
						description: await message.translate("Please select the new language for the bot."),
						dropdownItems: [{
							label: await message.translate("English"),
							emoji: "🇺🇸",
							value: "en"
						}, {
							label: await message.translate("Spanish"),
							emoji: "🇪🇸",
							value: "es"
						}, {
							label: await message.translate("French"),
							emoji: "🇫🇷",
							value: "fr"
						}, {
							label: await message.translate("German"),
							emoji: "🇩🇪",
							value: "de"
						}, {
							label: await message.translate("Italian"),
							emoji: "🇮🇹",
							value: "it"
						}, {
							label: await message.translate("Dutch"),
							emoji: "🇳🇱",
							value: "nl"
						}, {
							label: await message.translate("Portuguese"),
							emoji: "🇵🇹",
							value: "pt"
						}, {
							label: await message.translate("Russian"),
							emoji: "🇷🇺",
							value: "ru"
						}],
						color: "Blue",
						time: 15,
						handleData: async (collected: any, requestMsg?: any) => {
							requestMsg
								.setTitle(await message.translate(`${bot.config.emojis.config} | New Language Changed`))
								.setDescription(`${await message.translate("Successfully changed language from")} "**${data.guild.language}**" ${await message.translate("to")} **${collected}**.`);

							data.guild.language = collected;
							data.guild.markModified("language");
							await data.guild.save();
						}
					});
				}
			}],
			stateDisabled: true
		}, {
			name: await message.translate("Logging"),
			description: await message.translate("Log actions in your server!"),
			id: "logging",
			emoji: bot.config.emojis.stats,
			emojiID: "947990408657518652",
			category: true,
			categories: [{
				name: "General",
				description: "General log actions. (Message (Deleted/Edited), User (Warned/Kicked/Banned))",
				id: "general",
				emoji: bot.config.emojis.stats,
				emojiID: "947990408657518652",
				data: new ButtonBuilder().setLabel(await message.translate("general")).setEmoji(bot.config.emojis.stats).setCustomId("general").setStyle(ButtonStyle.Secondary),
				buttons: [{
					name: "Toggle",
					data: ToggleButton,
					getData: () => data.guild.logging?.enabled || "false"
				}, {
					name: "Channel",
					required: true,
					data: channelButton,
					getData: () => data.guild.logging?.channel ? `<#${data.guild.logging.channel}>` : "None",
					setData: async () => {
						await setNewData(message, {
							title: `${bot.config.emojis.config} | Logging Channel Setup`,
							description: "Please send a channel to setup the logging system in. You have 60 seconds to send a channel.",
							color: "Blue",
							time: 60,
							handleData: async (collected: any, requestMsg?: any) => {
								if (!collected?.mentions?.channels?.first()) return requestMsg.setTitle(`${bot.config.emojis.config} | Logging Channel Setup`)
									.setDescription(`${bot.config.emojis.alert} Input provided was not a channel.`).setColor(Colors.Red);

								requestMsg
									.setTitle(`${bot.config.emojis.config} | Logging Channel Setup`)
									.setDescription(`Successfully setup logging channel to ${collected.content}.`);

								data.guild.logging.channel = collected.content.slice(2, -1);
								data.guild.markModified("logging.channel");
								await data.guild.save();
							}
						});
					}
				}],
				getState: () => data.guild.logging?.enabled,
				setState: async (type: any) => {
					switch (type) {
						case "enable": { data.guild.logging.enabled = "true"; break; }
						case "disable": { data.guild.logging.enabled = "false"; }
					}
					data.guild.markModified("logging.enabled");
					await data.guild.save();
				}
			}],
			stateDisabled: true
		}, {
			name: "Leveling",
			id: "leveling",
			emoji: bot.config.emojis.arrows.up,
			emojiID: "954930080436609055",
			description: "Allow users to level up in your server.",
			disabled: false,
			buttons: [{
				name: "Toggle",
				data: ToggleButton,
				getData: () => data.guild.leveling?.enabled || "false"
			}, {
				name: "Message",
				data: new ButtonBuilder().setLabel("Message").setEmoji(bot.config.emojis.message).setCustomId("message").setStyle(ButtonStyle.Danger),
				getData: () => data.guild?.leveling?.message ? data.guild.leveling.message : "None",
				setData: async () => {
					await setNewData(message, {
						title: `${bot.config.emojis.config} | Leveling Message Setup`,
						description: "Please send text that will be said when a user levels up. You have 60 seconds to send some text. Default: `<a:tada:819934065414242344> Congrats {author}, you're now at level **{level}**!`\n**Placeholders**\n{author} - The user who leveled up.\n{level} - The user's new level.",
						color: "Blue",
						time: 60,
						filter: async (m: any) => !m.author.id === m.client.user.id,
						handleData: async (collected: any, requestMsg?: any) => {
							if (!collected.content) return await collected.replyT("Dude... I need you to send a message. Not a picture.");
							if (collected.content.length >= 500) await collected.replyT(`${bot.config.emojis.error} | The new leveling message cannot be longer than 500 characters. Try again.`);

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
				getData: () => data.guild.leveling?.channel ? `<#${data.guild.leveling.channel}>` : "None",
				setData: async () => {
					await setNewData(message, {
						title: `${bot.config.emojis.config} | Leveling Channel Setup`,
						description: "Please send a channel to revieve level up notifications in. You have 60 seconds to send a channel.",
						color: "Blue",
						time: 60,
						handleData: async (collected: any, requestMsg?: any) => {
							if (!collected?.mentions?.channels?.first()) return requestMsg.setTitle(`${bot.config.emojis.config} | Leveling Channel Setup`)
								.setDescription(`${bot.config.emojis.alert} Input provided was not a channel.`).setColor(Colors.Red);

							requestMsg
								.setTitle(`${bot.config.emojis.config} | Leveling Channel Setup`)
								.setDescription(`Successfully setup leveling channel to ${collected.content}.`);

							data.guild.leveling.channel = collected.content.slice(2, -1);
							data.guild.markModified("leveling.channel");

							await data.guild.save();
						}
					});
				}
			}],
			getState: () => data.guild.leveling?.enabled,
			setState: async (type: any) => {
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
			buttons: [{
				name: await message.translate("Category"),
				required: true,
				data: channelButton.setLabel(await message.translate("Category")).setCustomId("category"),
				getData: () => data?.guild?.tickets?.category ? `<#${data.guild.tickets.category}>` : "None",
				setData: async () => {
					await setNewData(message, {
						title: await message.translate(`${bot.config.emojis.config} | Tickets Category Setup`),
						description: await message.translate("Please send a category ID to setup the starboard in. **You can automaticly skip this step if you run the `/panel tickets` command. **You have 60 seconds to send a category ID."),
						color: "Blue",
						time: 60,
						filter: async (m: any) => {
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
						handleData: async (collected: any, requestMsg?: any) => {
							requestMsg
								.setTitle(await message.translate(`${bot.config.emojis.config} | Tickets Channel Setup`))
								.setDescription(await message.translate(`Successfully setup tickets channel to ${collected.content}.`));

							data.guild.tickets.category = collected.content;
							data.guild.markModified("tickets.category");
							await data.guild.save();
						}
					});
				}
			}, {
				name: "Roles",
				required: true,
				data: new ButtonBuilder().setLabel("Support Roles").setEmoji(bot.config.emojis.special).setCustomId("roles").setStyle(ButtonStyle.Secondary),
				getData: () => data.guild?.tickets?.roles ? data.guild?.tickets?.roles.map((r: any) => `<@&${r}>`).join(", ") : "None",
				setData: async () => {
					await setNewData(message, {
						title: await message.translate(`${bot.config.emojis.config} | Support Roles Setup`),
						description: await message.translate("Please mention support role(s). Support roles are roles that will grant users access to see tickets. You have 60 seconds to send a channel."),
						color: "Blue",
						time: 60,
						handleData: async (collected: any, requestMsg?: any) => {
							if (!message?.mentions?.roles?.first()) {
								return requestMsg
									.setTitle(`${bot.config.emojis.config} | Support Roles Setup`)
									.setDescription(`Setup failed because the input provided was not a role.`)
									.setColor(Colors.Red);
							}

							const roles: any[] = [];
							collected.mentions.roles.forEach((r: any) => roles.push(r.id));

							requestMsg
								.setTitle(`${bot.config.emojis.config} | Support Roles Setup`)
								.setDescription(`Successfully setup support roles to ${collected.content}.`);

							data.guild.tickets.roles = roles;
							data.guild.markModified("tickets.roles");

							await data.guild.save();
						}
					});
				}
			}],
			stateDisabled: true
		}, {
			name: await message.translate("Moderate"),
			description: await message.translate("Take your server moderation to the next level!"),
			id: "moderate",
			emoji: bot.config.emojis.ban,
			emojiID: "966075832265220167",
			category: true,
			categories: [{
				name: await message.translate("AntiScam"),
				description: await message.translate("Take action against links that are known to be scams."),
				id: "antiscam",
				emoji: bot.config.emojis.warning,
				emojiID: "953769677534945360",
				data: new ButtonBuilder().setLabel(await message.translate("AntiScam")).setEmoji(bot.config.emojis.warning).setCustomId("antiscam").setStyle(ButtonStyle.Secondary),
				buttons: [{
					name: "Toggle",
					data: ToggleButton,
					getData: () => data.guild.antiScam?.enabled || "false"
				}, {
					name: await message.translate("Actions"),
					required: true,
					data: new ButtonBuilder().setLabel(await message.translate("Actions")).setEmoji(bot.config.emojis.ban).setCustomId("actions").setStyle(ButtonStyle.Secondary),
					getData: () => data.guild?.antiScam?.action || "None",
					setData: async () => {
						await setNewData(message, {
							title: `${bot.config.emojis.config} | AntiScam Actions`,
							description: "Please select the actions to take when a user sends a scam link. You have 60 seconds.",
							id: "scamLinks",
							color: "Yellow",
							dropdownItems: [{
								label: await message.translate("Timeout"),
								emoji: bot.config.emojis.timeout,
								value: "timeout"
							}, {
								label: await message.translate("Kick"),
								emoji: bot.config.emojis.kick,
								value: "kick"
							}, {
								label: await message.translate("Ban"),
								emoji: bot.config.emojis.ban,
								value: "ban"
							}],
							handleData: async (collected: any, requestMsg?: any) => {
								requestMsg
									.setTitle(`${bot.config.emojis.config} | AntiScam Actions`)
									.setDescription(`${bot.config.emojis.success} | Successfully set actions to ${collected}.`)
									.setColor(Colors.Green);

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
					// 	data: new ButtonBuilder()
					// 		.setLabel(await message.translate("Custom Words"))
					// 		.setEmoji(bot.config.emojis.ban)
					// 		.setCustomId("custom")
					// 		.setStyle(ButtonStyle.Secondary),
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
				setState: async (type: any) => {
					if (type === "enable") data.guild.antiScam.enabled = "true";
					else if (type === "disable") data.guild.antiScam.enabled = "false";
					data.guild.markModified("antiScam.enabled");
					await data.guild.save();
				}
			}, {
				name: await message.translate("AntiSpam"),
				description: await message.translate("Take action against spam in your Discord server."),
				id: "antispam",
				emoji: bot.config.emojis.message,
				emojiID: "966496523955339264",
				data: new ButtonBuilder().setLabel(await message.translate("AntiSpam")).setEmoji(bot.config.emojis.message).setCustomId("antispam").setStyle(ButtonStyle.Secondary),
				buttons: [{
					name: "Toggle",
					data: ToggleButton,
					getData: () => data.guild.antiSpam?.enabled || "false"
				}, {
					name: await message.translate("Actions"),
					required: true,
					data: new ButtonBuilder().setLabel(await message.translate("Actions")).setEmoji(bot.config.emojis.ban).setCustomId("actions").setStyle(ButtonStyle.Secondary),
					getData: () => data.guild?.antiSpam?.action || "None",
					setData: async () => {
						await setNewData(message, {
							title: `${bot.config.emojis.config} | AntiSpam Actions`,
							description: "Please select the actions to take when a user spams. You have 60 seconds.",
							id: "antiSpam",
							color: "Yellow",
							dropdownItems: [{
								label: await message.translate("Timeout"),
								emoji: bot.config.emojis.timeout,
								value: "timeout"
							}, {
								label: await message.translate("Kick"),
								emoji: bot.config.emojis.kick,
								value: "kick"
							}, {
								label: await message.translate("Ban"),
								emoji: bot.config.emojis.ban,
								value: "ban"
							}],
							handleData: async (collected: any, requestMsg?: any) => {
								requestMsg
									.setTitle(`${bot.config.emojis.config} | AntiSpam Actions`)
									.setDescription(`${bot.config.emojis.success} | Successfully set actions to ${collected}.`)
									.setColor(Colors.Green);

								data.guild.antiSpam.action = collected;
								data.guild.markModified("antiSpam.action");

								await data.guild.save();
							}
						});
					}
				}],
				getState: () => data.guild.antiSpam?.enabled,
				setState: async (type: any) => {
					if (type === "enable") data.guild.antiSpam.enabled = "true";
					else if (type === "disable") data.guild.antiSpam.enabled = "false";

					data.guild.markModified("antiSpam.enabled");

					await data.guild.save();
				}
			}],
			stateDisabled: true
		}, {
			name: "Starboard",
			id: "starboard",
			emoji: bot.config.emojis.star,
			emojiID: "948013324216434718",
			description: "The channel to setup the starboard in. Leave blank to disable.",
			buttons: [{
				name: "Toggle",
				data: ToggleButton,
				getData: () => data.guild.starboard?.enabled || "false"
			}, {
				name: "Channel",
				required: true,
				enabledText: "Successfully setup channel!",
				data: new ButtonBuilder().setLabel("Channel").setEmoji(bot.config.emojis.channel).setCustomId("channel").setStyle(ButtonStyle.Secondary),
				getData: () => data.guild.starboard?.channel ? `<#${data.guild.starboard.channel}>` : "None",
				setData: async () => {
					await setNewData(message, {
						title: `${bot.config.emojis.config} | Starboard Channel Setup`,
						description: "Please send a channel to setup the starboard in. You have 60 seconds to send a channel.",
						color: "Gold",
						time: 60,
						handleData: async (collected: any, requestMsg?: any) => {
							if (!collected?.mentions?.channels?.first()) return requestMsg.setTitle(`${bot.config.emojis.config} | Starboard Channel Setup`)
								.setDescription(`${bot.config.emojis.alert} Input provided was not a channel.`).setColor(Colors.Red);

							requestMsg
								.setTitle(`${bot.config.emojis.config} | Starboard Channel Setup`)
								.setDescription(`Successfully setup starboard channel to ${collected.content}.`);

							data.guild.starboard.channel = collected.content.slice(2, -1);
							data.guild.markModified("starboard.channel");

							await data.guild.save();
						}
					});
				}
			}, {
				name: "Emoji",
				data: new ButtonBuilder().setLabel("Emoji").setEmoji(bot.config.emojis.star).setCustomId("emoji").setStyle(ButtonStyle.Secondary),
				getData: () => data.guild.starboard?.emoji || "⭐",
				setData: async () => {
					await setNewData(message, {
						title: `${bot.config.emojis.config} | Changing Starboard Emoji`,
						description: "Please send an emoji to change the default starboard emoji to a new one. Keep in mine, users will be no longer able to react with a star to put on the starboard, and will have to use this new emoji for it. You have 30 seconds to send an emoji.",
						color: "Gold",
						time: 30,
						filter: async (m: any) => {
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
						handleData: async (collected: any, requestMsg?: any) => {
							requestMsg
								.setTitle(`${bot.config.emojis.config} | Changing Starboard Emoji`)
								.setDescription(`Successfully changed starboard emoji from ${data.guild.starboard.emoji} to ${collected.content}.`);

							data.guild.starboard.emoji = collected.content;
							data.guild.markModified("starboard.emoji");

							await data.guild.save();
						}
					});
				}
			}, {
				name: "Minimum",
				data: new ButtonBuilder()
					.setLabel("Minimum")
					.setEmoji(bot.config.emojis.numbers.two)
					.setCustomId("minimum")
					.setStyle(ButtonStyle.Secondary),
				getData: () => data.guild.starboard?.min || 2,
				setData: async () => {
					await setNewData(message, {
						title: `${bot.config.emojis.config} | Changing Starboard Minimum`,
						description: "Please send a number to change the minimum amount of stars required to create a star message. You have 15 seconds to send a number.",
						color: "Gold",
						time: 15,
						filter: async (m: any) => {
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
						},
						handleData: async (collected: any, requestMsg?: any) => {
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
			setState: async (type: any) => {
				if (type === "enable") data.guild.starboard.enabled = "true";
				else if (type === "disable") data.guild.starboard.enabled = "false";
				data.guild.markModified("starboard.enabled");
				await data.guild.save();
			}
		}];
	}

	let pages: any[] = [];
	let buttons: any[] = [];
	let curSetting: any;
	async function refreshSetting(curSetting: any) {
		buttons = [];
		pages = [];
		await createPages();

		function handleButton(button: any) {
			if (button.name.toLowerCase() === "toggle") return buttonsIncluded.push(button?.data?.setDisabled(false).setStyle(button.getData() === "true" ? ButtonStyle.Success : ButtonStyle.Danger));
			if (curSetting?.stateDisabled === true) return buttonsIncluded.push(button?.data?.setDisabled(false));
			if (curSetting?.getState() === "true") buttonsIncluded.push(button?.data?.setDisabled(false));
			else if (curSetting?.getState() === "false") buttonsIncluded.push(button?.data?.setDisabled(true));
		};

		const buttonsIncluded: any[] = [];
		curSetting?.category === true ? curSetting.categories.forEach((button: any) => handleButton(button)) : curSetting?.buttons?.forEach((button: any) => handleButton(button));

		buttons.push({ type: 1, components: buttonsIncluded });
		buttons.push({ type: 1, components: [BackButton, WebsiteButton, SupportButton] });

		const page = pages.find(page => page.author.name.toLowerCase().includes(curSetting.name.toLowerCase()));
		if (!page) return;

		await botMessage.edit({
			embeds: [page],
			components: buttons,
			ephemeral: true
		});
	};

	const Menu = new EmbedBuilder()
		.setAuthor({
			name: "SparkV Settings Menu",
			iconURL: bot.user.displayAvatarURL()
		})
		.setDescription(`**${data.options.getString("type") === "server" ? `Personalize ${message.guild.name}` : `Edit Account Settings`}**\nSelect a setting using the buttons below.\n${settings.map((setting: any) => {
			const state = setting?.stateDisabled === true ? bot.config.emojis.slash : (setting?.getState() === "true" ? bot.config.emojis.success : bot.config.emojis.error);
			return `${state ? `${state} ` : ""}${setting.name}`;
		}).join("\n")}`)
		.setFooter({
			text: await message.translate(`Select a setting to edit below. • ${bot.config.embed.footer}`),
			iconURL: bot.user.displayAvatarURL()
		})
		.setColor(Colors.Blue)
		.setTimestamp();

	const ExitButton = new ButtonBuilder().setLabel("Exit").setEmoji(bot.config.emojis.leave).setCustomId("exit").setStyle(ButtonStyle.Danger);
	const BackButton = new ButtonBuilder().setLabel("Back").setEmoji(bot.config.emojis.arrows.left).setCustomId("back").setStyle(ButtonStyle.Secondary);
	const WebsiteButton = new ButtonBuilder().setURL(`https://www.sparkv.tk/`).setEmoji(bot.config.emojis.globe).setLabel("Website").setStyle(ButtonStyle.Link);
	const SupportButton = new ButtonBuilder().setURL(bot.config.support).setLabel("Support").setStyle(ButtonStyle.Link);

	async function createPages() {
		settings.forEach((setting: any) => {
			pages.push({
				author: { name: `${setting.emojiID ? "" : setting.emoji}SparkV ${setting.name}`, icon_url: `https://cdn.discordapp.com/emojis/${setting.emojiID}.webp?size=56&quality=lossless` },
				description: `${setting.description}\n\n${(setting?.category === true ? setting.categories.map((cat: any) => `${cat.name}`) : setting?.buttons?.map((button: any) => `${button.getData() === "true" ? bot.config.emojis.success : (button.getData() === "false" ? bot.config.emojis.error : bot.config.emojis.slash)} ${button.name}: **${button.getData()}**`)).join("\n")}`,
				color: Colors.Blue,
				timestamp: new Date()
			});

			if (setting.category === true) {
				setting.categories.forEach((category: any) => pages.push({
					author: { name: `${category.emojiID ? "" : category.emoji}SparkV ${category.name}`, icon_url: `https://cdn.discordapp.com/emojis/${category.emojiID}.webp?size=56&quality=lossless` },
					description: `${category.description}\n\n${category.buttons.map((button: any) => `${button.getData() === "true" ? bot.config.emojis.success : (button.getData() === "false" ? bot.config.emojis.error : bot.config.emojis.slash)} ${button.name}: **${button.getData()}**`).join("\n")}`,
					color: Colors.Blue,
					timestamp: new Date()
				}));
			};
		})
	};

	let rows: number = 0;
	async function setupSettings() {
		settings.forEach(async (setting: any) => {
			const SettingButton = new ButtonBuilder()
				.setLabel(setting.name)
				.setEmoji(setting.emoji)
				.setCustomId(setting.id)
				.setStyle(ButtonStyle.Primary)
				.setDisabled(setting?.disabled ? setting.disabled : false);

			if (!buttons[rows]) {
				buttons[rows] = { type: 1, components: [SettingButton] };
			} else if (buttons[rows]?.components?.length >= 5) {
				buttons.push({ type: 1, components: [SettingButton] });
				++rows;
			} else { buttons[rows].components.push(SettingButton); }
		});
	}

	await createPages();
	await setupSettings();
	buttons.push({ type: 1, components: [ExitButton, WebsiteButton, SupportButton] });

	await bot.wait(750);
	if (!message.channel.permissionsFor(message.user).has("ManageGuild") && data.options.getString("type") === "server") {
		if (bot.config.owners.includes(message?.user?.id)) {
			await botMessage.edit({
				embeds: [{
					author: {
						name: message.user.tag,
						iconURL: message.user.displayAvatarURL()
					},
					description: `${bot.config.emojis.alert} | You do not have permission (MANAGE_GUILD) to manage this guild's settings for SparkV. However, you're my owner so you can have access. Please select below \`yes\` or \`no\` to continue.`,
					color: Colors.Red
				}],
				components: [{
					type: 1,
					components: [{
						type: 2,
						emoji: bot.config.emojis.success,
						label: "Yes",
						customId: "yes",
						style: 3
					}, {
						type: 2,
						emoji: bot.config.emojis.error,
						label: "No",
						customId: "no",
						style: 4
					}]
				}, {
					type: 1,
					components: [WebsiteButton, SupportButton]
				}],
				fetchReply: true,
				ephemeral: true
			});

			const collector = botMessage.createMessageComponentCollector({
				filter: async (interaction: ButtonInteraction) => {
					if (interaction.user.id !== message.user.id) {
						await interaction.reply({
							content: `Only ${message.user} can edit these settings!`,
							ephemeral: true
						});
					}

					return interaction.user.id === message.user.id;
				}, time: 300 * 1000, max: 1
			});
			collector.on("collect", async (interaction: any) => {
				if (!interaction.deferred) interaction.deferUpdate().catch(() => { });
				if (interaction.customId === "no") {
					await botMessage.edit({
						embeds: [{
							author: { name: message.user.tag, icon_url: message.user.displayAvatarURL() },
							description: `${bot.config.emojis.alert} | You have chosen to not manage this guild's settings for SparkV.`,
							color: Colors.Red
						}],
						components: [{
							type: 1,
							components: [WebsiteButton, SupportButton]
						}],
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
				embeds: [{
					author: { name: message.user.tag, icon_url: message.user.displayAvatarURL() },
					description: `${bot.config.emojis.alert} | You do not have permission (MANAGE_GUILD) to manage this server's settings for SparkV. Please contact the server owner to request this permission.`,
					color: Colors.Red
				}],
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
		filter: async (interaction: any) => {
			if (interaction.user.id !== message.user.id) await interaction.reply({ content: `Only ${message.user} can edit these settings!`, ephemeral: true });

			return interaction.user.id === message.user.id;
		}, time: 300 * 1000
	});

	collector.on("collect", async (interaction: any) => {
		if (!interaction.deferred) interaction.deferUpdate().catch(() => { });
		try {
			buttons = [];
			switch (interaction.customId) {
				case "back": {
					setupSettings();

					buttons.push({ type: 1, components: [ExitButton, WebsiteButton, SupportButton] });
					buttons = buttons.filter(Boolean);
					curSetting = null;

					await botMessage.edit({
						embeds: [Menu],
						components: buttons ?? [],
						ephemeral: true
					});
					break;
				} case "exit": { await collector.stop(); break; }
				case "toggle": {
					if (curSetting && curSetting?.buttons?.find((button: any) => button?.name?.toLowerCase() === "toggle")) {
						if ((curSetting.getState() === "true" ? "false" : "true") === "true") {
							await curSetting.setState("enable");
							curSetting?.buttons?.forEach(async (button: any) => button?.required === true && await button.setData());
						} else { await curSetting.setState("disable"); }

						refreshSetting(curSetting);
					}
					break;
				} default: {
					if (curSetting?.buttons?.find((button: any) => button?.data?.data?.custom_id?.toLowerCase() === interaction?.customId?.toLowerCase())) {
						await curSetting?.buttons?.find((button: any) => button.data.data.custom_id.toLowerCase() === interaction.customId.toLowerCase()).setData();
						return refreshSetting(curSetting);
					}

					let foundSetting;
					settings.forEach(setting => {
						if (setting?.category === true) {
							if ((setting.id.toLowerCase() === interaction.customId.toLowerCase()) === true) foundSetting = setting;
							if (setting?.categories.find((cat: any) => cat.id.toLowerCase() === interaction.customId.toLowerCase())) foundSetting = setting?.categories.find((cat: any) => cat.id.toLowerCase() === interaction.customId.toLowerCase());
						}

						if ((setting.id.toLowerCase() === interaction.customId.toLowerCase()) === true) foundSetting = setting;
					});

					curSetting = foundSetting;
					curSetting && refreshSetting(curSetting);
				}
			}
		} catch (error: any) {
			bot.logger(error, "error", { data: error, interaction });
			try {
				return await botMessage.edit({
					embeds: [{
						author: { name: message.user.tag, iconURL: message.user.displayAvatarURL() },
						description: `${bot.config.emojis.alert} | **Uh oh!**\nA critical error has occured with either with our database, or handling Discord API. Please contact support [here](https://discord.gg/PPtzT8Mu3h).\n\n${error?.message ?? error}`,
						color: Colors.Red
					}],
					ephemeral: true
				});
			} catch (err) { }
		}
	});

	collector.on("end", async () => {
		try {
			return await botMessage.edit({
				embeds: [{
					author: { name: message.user.tag, icon_url: message.user.displayAvatarURL() },
					description: `${bot.config.emojis.alert} | Saved changes and exited the settings menu.`,
					color: Colors.Blue
				}],
				components: []
			});
		} catch (err) { }
	});
}

export default new cmd(execute, {
	description: "Personalize SparkV to suit your server, or to change your user settings.",
	dirname: __dirname,
	usage: "",
	aliases: [],
	perms: [],
	cooldown: 30,
	slash: true,
	slashOnly: true,
	options: [{
		type: 3,
		name: "type",
		description: "What would you like to personalize about SparkV?",
		choices: [{
			name: "server",
			value: "server"
		}, {
			name: "user",
			value: "user"
		}],
		required: true
	}]
});