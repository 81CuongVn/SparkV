import Discord, { Colors, ButtonStyle, ChannelType } from "discord.js";
import axios from "axios";

import cursewords from "../../cursewords.json";

const messages: any[] = [];

// Timeout user
function timeoutUser(offense: string, message: any, data: any) {
	if (message.member.isCommunicationDisabled()) return;

	message.member.timeout((10 * data.member.infractionsCount) * 1000, `Placed on timeout for ${message.client.functions.MSToTime((10 * data.member.infractionsCount) * 1000)} for ${offense}.`)
		.then(async () => {
			const timeoutEmbed = new Discord.EmbedBuilder()
				.setAuthor({
					name: message.author.tag,
					iconURL: message.author.displayAvatarURL()
				})
				.setDescription(`${message.client.config.emojis.alert} | You've been placed on timeout for ${message.client.functions.MSToTime((10 * data.member.infractionsCount) * 1000)} for ${offense}.`)
				.setColor(Colors.Red)
				.setTimestamp();

			await message.channel.send({
				embeds: [timeoutEmbed]
			}).catch((): any => { });
		}).catch((): any => { });
}

export default {
	once: false,
	async execute(bot: any, message: any) {
		// If the application owner isn't ready yet, wait for it.
		if (!bot.application?.owner) await bot.application?.fetch().catch((): any => { });

		// If the message and/or channel are partials, fetch them.
		if (message.channel?.partial) await message.channel.fetch().catch((): any => { });
		if (message?.partial) await message.fetch().catch((): any => { });

		// If the message's author is a bot, return. This prevents SparkV from responding to himself.
		if (message?.author?.bot) return;

		// If the message is from a DM, return. This prevents SparkV from responding to DMs.
		if (message?.channel?.type === ChannelType.DM) return;

		// If the bot cannot send messages, return.
		const botMember = await message.guild.members.fetch(bot.user.id)
		if (!botMember.permissionsIn(message.channel).has("SendMessages")) return;

		// If the guild is part of the guild blacklist, return.
		if (bot.config.blacklist.guilds[message.guild.id]) return await message.replyT(`Your server has been blacklisted. Reason: ${bot.config.blacklist.guilds[message.guild.id]}\n\nIf you think this ban wasn't correct, please contact support. (https://discord.gg/PPtzT8Mu3h)`);

		// Cache the member.
		if (message.guild && !message.member) await message.guild.members.fetch(message?.author?.id);

		// Data
		const data: any = {};

		// Get the Guild
		if (message.guild) {
			const guild = await bot.database.getGuild(message.guild.id);

			data.guild = guild;
			message.guild.data = data.guild;
		}

		if (message.guild && message?.author?.id && message?.guild?.id) data.member = await bot.database.getMember(message?.author?.id, message?.guild?.id);

		// User data
		data.user = await bot.database.getUser(message.author.id);

		if (!data) return;

		// Plugins
		if (message.guild) {
			// Vote reminder
			if (data.user.votes.reminded === "true" && (43200000 - (Date.now() - data.user.votes.voted)) > 0) {
				data.user.votes.reminded = "false";
				data.user.markModified("votes.reminded");
				await data.user.save();
			}

			if (data.user.votes.remind === "true" && data.user.votes.reminded === "false") {
				if ((43200000 - (Date.now() - data.user.votes.voted)) > 0) {
					message.author.send({
						embeds: [{
							author: { name: message.author.tag, icon_url: message.author.displayAvatarURL() },
							description: `${bot.config.emojis.alert} | **Hi there!**\nYou're able to vote for me on top.gg. You've voted **${data.user.votes.total} times**, and **last voted <t:${~~(data.user.votes.voted / 1000)}:R>**.`,
							color: Colors.Blue,
							timestamp: new Date()
						}],
						components: [{
							type: 1,
							components: [{
								type: 2,
								label: "Vote",
								emoji: "<:topgg:946558388261769227>",
								url: "https://top.gg/bot/884525761694933073/vote",
								style: 5
							}]
						}]
					});

					data.user.votes.reminded = "true";
					data.user.markModified("votes.reminded");
					await data.user.save();
				}
			}

			// Check user for AFK Status
			if (data.user.afk?.enabled === "true") {
				data.user.afk.enabled = "false";
				data.user.afk.reason = null;
				data.user.markModified("afk.enabled");
				data.user.markModified("afk.reason");
				await data.user.save();

				await message.replyT({
					embeds: [{
						author: { name: message.author.tag, icon_url: message.author.displayAvatarURL() },
						description: `${bot.config.emojis.wave} | Hey **${message.author}**, welcome back! I removed your AFK status.`,
						color: Colors.Blue,
						timestamp: new Date()
					}]
				});
			}

			// Check mentions for AFK
			message.mentions.users.forEach(async (u: any) => {
				const mentionedUserData = await bot.database.getUser(u.id);
				if (mentionedUserData?.afk?.enabled === "true") await message.replyT({
					embeds: [{
						author: { name: message.author.tag, icon_url: message.author.displayAvatarURL() },
						description: `${bot.config.emojis.alert} | **${u.tag}** is currently AFK.${mentionedUserData?.afk?.reason ? ` **${mentionedUserData?.afk?.reason}**` : ""}`,
						color: Colors.Red,
						timestamp: new Date()
					}]
				});
			});

			// Check for scam links.
			if (data.guild?.antiScam.enabled === "true") {
				if (!message.channel.permissionsFor(message.member).has("ManageMessages")) {
					let scamLinks = await bot.redis.get("bot_scamlinks").then((res: any) => JSON.parse(res));
					if (!scamLinks) {
						scamLinks = await axios.get("https://phish.sinking.yachts/v2/all").then(res => res.data).catch((): any => message.replyT("Failed to fetch scam links."));

						await bot.redis.set("bot_scamlinks", JSON.stringify(scamLinks), { EX: 172800 });
					}

					const httpsRegex = /(https?:\/\/)?(www\.)?/g;
					let cleanMessage = message.cleanContent.toLowerCase().replaceAll(httpsRegex, "");
					cleanMessage.endsWith("/") && (cleanMessage = cleanMessage.slice(0, -1));

					if (scamLinks.includes(cleanMessage) || data.guild?.antiScam?.custom.includes(cleanMessage)) {
						try { message.delete().catch((): any => { }); } catch (err: any) {
							message.replyT(`${bot.config.emojis.error} | Uh oh! This URL is known to be a scam link. I cannot delete it due to invalid permissions. Please make sure I have \`ManageMessages\` enabled for me.`);
						}

						++data.member.infractionsCount;
						data.member.infractions.push({
							type: "scamlink",
							date: Date.now()
						});

						data.member.markModified("infractionsCount");
						data.member.markModified("infractions");
						await data.member.save();

						if (data.guild?.antiScam?.action === "timeout") {
							timeoutUser("sending a scam link", message, data);
							bot.emit("scamLinkSent", message, data);
						} else if (data.guild?.antiScam?.action === "kick") {
							message.member.kick({ reason: `Sent a scam link. (${cleanMessage})` });
							bot.emit("scamLinkSent", message, data);
						} else if (data.guild?.antiScam?.action === "ban") {
							message.member.ban({ reason: `Sent a scam link. (${cleanMessage})` });
							bot.emit("scamLinkSent", message, data);
						}
					}
				}
			}

			// Check for profanity (curse words)
			if (data.guild.automod.removeProfanity === "true") {
				if (!message.channel.permissionsFor(message.member).has("ManageMessages")) {
					const ignoredWords = ["hello"];
					let cursed = false;

					for (var i in cursewords) {
						if (message.content.toLowerCase().includes(cursewords[i].toLowerCase())) cursed = true;
					}

					for (var i in ignoredWords) {
						if (message.content.toLowerCase().includes(ignoredWords[i].toLowerCase())) cursed = false;
					}

					if (cursed) {
						++data.member.infractionsCount;
						data.member.infractions.push({
							type: "cursing",
							date: Date.now()
						});

						data.member.markModified("infractionsCount");
						data.member.markModified("infractions");
						await data.member.save();
						timeoutUser("cursing", message, data);
					}
				}
			}

			// // Check for links
			// if (data.guild.automod.removeLinks === "true") {
			// 	if (
			// 		!message.channel.permissionsFor(message.member).has("ManageMessages") &&
			// 		!message.channel.permissionsFor(message.member).has("ADMINISTRATOR") &&
			// 		bot.functions.isURL(message.content)
			// 	) {
			// 		++data.member.infractionsCount;
			// 		data.member.infractions.push({
			// 			type: "links",
			// 			date: Date.now()
			// 		});

			// 		data.member.markModified("infractionsCount");
			// 		data.member.markModified("infractions");
			// 		await data.member.save();

			// 		try {
			// 			message.delete().catch((): any: any => { });
			// 		} catch (err: any) {
			// 			message.replyT("Invalid permsissions to delete this message.");
			// 		}
			// 		timeoutUser("sending links", message, data);
			// 	}
			// }

			// Check for spam
			if (data.guild.antiSpam.enabled === "true") {
				if (!message.channel.permissionsFor(message.member).has("ManageMessages")) {
					if (!message.channel.name.startsWith("spam") && !message.channel.name.endsWith("spam")) {
						messages.push({
							messageID: message.id,
							guildID: message.guild.id,
							authorID: message.author.id,
							channelID: message.channel.id,
							content: message.content,
							sendTimestamp: message.createdTimestamp
						} as { messageID: string, guildID: string, authorID: string, channelID: string, content: string, sendTimestamp: string });

						const foundMatches = messages.filter((msg: any) => msg.authorID === message.author.id && msg.guildID === message.guild.id);
						if (!foundMatches) return;

						const matches = foundMatches.filter((msg: any) => msg.sendTimestamp > Date.now() - 6500);
						if (matches.length >= 5) {
							++data.member.infractionsCount;
							data.member.infractions.push({
								type: "spam",
								date: Date.now()
							});

							data.member.markModified("infractionsCount");
							data.member.markModified("infractions");
							await data.member.save();

							matches.forEach((message: any) => {
								const channel = bot.channels.cache.get(message.channelID);
								if (channel) {
									const msg = channel.messages.cache.get(message.messageID);
									msg && msg.delete().catch((): any => { });
								}
							});

							switch (data.guild?.antiSpam?.action) {
								case "timeout": {
									timeoutUser("spamming", message, data);
									bot.emit("userSpammed", message, data);
									break;
								} case "kick": {
									message.member.kick({ reason: `Spammed multiple times.` });
									bot.emit("userSpammed", message, data);
									break;
								} case "ban": {
									message.member.ban({ reason: `Spammed multiple times.` });
									bot.emit("userSpammed", message, data);
								}
							}
						}
					}
				}
			}

			// Leveling!
			if (data.guild.leveling.enabled === "true") {
				const RandomXP: any = Math.floor(Math.random() * 15) + 5;

				data.member.xp += parseInt(RandomXP, 10);
				data.member.level = Math.floor(0.1 * Math.sqrt(data.member.xp));
				await data.member.save();

				if ((Math.floor(0.1 * Math.sqrt(data.member.xp -= RandomXP)) < data.member.level)) {
					const levelMsg = data.guild.leveling.message || "<a:tada:819934065414242344> Congrats {author}, you're now at level **{level}**!";

					if (data.guild.leveling?.channel && message.guild.channels.cache.find((c: any) => c.id === data.guild.leveling?.channel)) {
						const channel = message.guild.channels.cache.find((c: any) => c.id === data.guild.leveling.channel);

						try {
							await channel.send(levelMsg.toString().replaceAll(`{author}`, message.author).replaceAll(`{level}`, bot.functions.formatNumber(data.member.level)));
						} catch (err: any) {
							await message.replyT("Uh oh! I don't have access to the channel you've setup for leveling messages. If you need help fixing this, you can always contact support. Support Server: https://discord.gg/PPtzT8Mu3h");
							await message.replyT(levelMsg.toString().replaceAll(`{author}`, message.author).replaceAll(`{level}`, bot.functions.formatNumber(data.member.level)));
						}
					} else {
						await message.replyT(levelMsg.toString().replaceAll(`{author}`, message.author).replaceAll(`{level}`, bot.functions.formatNumber(data.member.level)));
					}
				}
			}
		}

		// If the user is part of the user blacklist, return.
		if (bot.config.blacklist.users[message.author.id]) return await message.replyT(`You have been blacklisted. Reason: ${bot.config.blacklist.users[message.author.id]}\n\nIf you think this ban wasn't correct, please contact support. (https://discord.gg/PPtzT8Mu3h)`);

		// Check for a prefix
		const prefix = process.argv.includes("--dev") === true ? "_" : "sv!";
		if (!message.content.toLowerCase().startsWith(prefix) && message.content.match(new RegExp(`^<@!?${bot.user.id}>( |)$`))) return message.replyT(`**Hi there!**\nPlease run \`/help\` to see what I can do. \It took me ${new Date().getTime() - message.createdTimestamp}ms to send this message.`);
		if (!message.content.toLowerCase().startsWith(prefix)) return;

		// Command Handler
		const args: string[] = message.content.slice(prefix?.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();
		const commandfile = bot.commands.get(command) || bot.aliases.get(command);

		if (!commandfile) return;
		if (!bot.config.owners.includes(message?.author?.id)) return;

		try {
			await commandfile.run(bot, message, args, command, data);
		} catch (err: any) {
			bot.logger(err, "error");

			await message.replyT({
				embeds: [{
					author: {
						name: message.author.tag,
						iconURL: message.author.displayAvatarURL()
					},
					title: "Uh oh!",
					description: `**An error occured while trying to run this command. Please contact support [here](https://discord.gg/PPtzT8Mu3h).**\n\n${err.message}`,
					color: "RED"
				}]
			});
		}
	}
};
