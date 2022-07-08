import Discord, { Role, Colors, ButtonInteraction } from "discord.js";
import canvacord from "canvacord";

import cmd from "../../../structures/command";

const cooldowns: any[] = [];

const statuses: any = {
	online: "<:online:948002054029340733>", idle: "<:idle:948003685118664784>",
	dnd: "<:dnd:948003123308396624>", offline: "<:offline:948002054247432202>"
};

const badges: any = {
	Staff: "<:staff:992980235307978877>", Partner: "<:partner:992979646964580362>",
	Hypesquad: "<:hypesquad:992980587256238192>", BugHunterLevel1: "<:bughunter:992981103847669831>", VerifiedDeveloper: "<:developer:992981818208952340>",
	HypeSquadOnlineHouse1: "<:house_bravery:941439956528803860>", HypeSquadOnlineHouse2: "<:house_brilliance:941439956507840543>",
	HypeSquadOnlineHouse3: "<:house_balance:941440238486691921>", CertifiedModerator: "<:moderator:943240444777730068>"
};

async function execute(bot: any, message: any, args: string[], command: any, data: any) {
	const user: any = await (data.options.getUser("user") || message.user).fetch().catch((): any => { });
	const member: any = message.channel.guild.members.cache.get(user.id);
	let userData: any = message.user.id === user.id ? data.user : await bot.database.getUser(user.id);
	let memberData: any = message.user.id === user.id ? data.member : await bot.database.getMember(member.id, message.guild.id);

	/* -------------------------------------------------- INFO PAGE --------------------------------------------------*/
	let addedRoles = 0;
	let num = 0;
	let roles = member.roles.cache.sort((a: Role, b: Role) => b.comparePositionTo(a)).map((r: Role) => {
		num++;
		if (num < 4) return `<@&${r?.id}>`;
		else addedRoles++;
	}).join(" ");
	if (addedRoles > 0) roles += `+${addedRoles}`;

	const infoEmbed = {
		fields: [{
			name: `${bot.config.emojis.player} ${await message.translate("User")} ${user.flags.toArray().length > 0 && user.flags.toArray().map((b: any) => badges[b as keyof typeof badges] ? badges[b as keyof typeof badges] : b).join(" ")}`,
			value: `\`\`\`${user?.tag}\`\`\``,
			inline: true
		}, {
			name: `${statuses[member?.presence?.status || "offline"]} ${await message.translate("Presence")}`,
			value: `\`\`\`${member?.presence?.status === "dnd" ? "Do Not Disturb" : (member?.presence?.status ? (member?.presence?.status.charAt(0).toUpperCase() + member?.presence?.status.slice(1)) : "Offline")}\`\`\``,
			inline: true
		}, {
			name: `${bot.config.emojis.id} ${await message.translate("ID")}`,
			value: `\`\`\`${user?.id}\`\`\``,
			inline: false
		}, {
			name: `${bot.config.emojis.plus} ${await message.translate("Registered")}`,
			value: `<t:${~~(user.createdAt / 1000)}:R>`,
			inline: true
		}, {
			name: `${bot.config.emojis.join} ${await message.translate("Joined Server")}`,
			value: `<t:${~~(member.joinedAt / 1000)}:R>`,
			inline: true
		}],
		color: user.accentColor || Colors.Blue,
		timestamp: new Date(),
		thumbnail: { url: (user.user ? user.user : user).displayAvatarURL() },
		image: { url: null as any }
	};

	roles && infoEmbed.fields.push({ name: `${bot.config.emojis.trophy} Roles (${member?.roles?.cache?.size ?? "0"})`, value: roles, inline: false });
	if (user.user ? user.user.banner : user.banner) infoEmbed.image.url = user.user ? user.user.bannerURL({ dynamic: true, size: 1024 }) : user.bannerURL({ dynamic: true, size: 1024 });

	/* -------------------------------------------------- GENERATE RANK IMAGE --------------------------------------------------*/
	let rankImage: any = null;
	if (data.guild.leveling.enabled === "true") {
		const leaderboard = await bot.MemberSchema.find({ guildID: message.guild.id }).sort([["xp", "descending"]]).exec();
		const Rank = new canvacord.Rank()
			.setUsername(member.user ? member.user.username : member.username)
			.setDiscriminator(member.user ? member.user.discriminator : member.discriminator)
			.setAvatar(member.displayAvatarURL({ forceStatic: true, extension: "png" }))
			.setStatus(member?.presence?.status || "offline", false)
			.setRank(leaderboard.findIndex((i: any) => i.guildID === message.guild.id && i.id === (member.user ? member.user.id : member.id)) + 1)
			.setLevel(memberData.level || 0)
			.setCurrentXP(memberData.xp || 0)
			.setRequiredXP(((parseInt(memberData.level) + 1) * (parseInt(memberData.level) + 1) * 100) || 100)
			.setProgressBar(`#0099ff`, `COLOR`);

		rankImage = await Rank.build().then(data => data)
	};

	/* -------------------------------------------------- SEND MESSAGE --------------------------------------------------*/
	const components = [{
		type: 1,
		components: [{
			type: 2,
			label: await message.translate("Avatar"),
			emoji: bot.config.emojis.image,
			style: 5,
			url: (user.user ? user.user : user).displayAvatarURL({ size: 1024 })
		}, {
			type: 2,
			emoji: bot.config.emojis.info,
			label: await message.translate("General"),
			customId: "info",
			style: 2,
		}, {
			type: 2,
			emoji: bot.config.emojis.backpack,
			label: await message.translate("Backpack"),
			customId: "backpack",
			style: 2,
		}, {
			type: 2,
			emoji: bot.config.emojis.ban,
			label: await message.translate("Mod History"),
			customId: "mod_history",
			style: 2,
		}]
	}]
	if (user.id !== message.user.id && !user.bot && data.user.money.balance >= 500 && userData.money.balance >= 0) components[1] = {
		type: 1,
		components: [{
			type: 2,
			label: await message.translate("Rob"),
			emoji: bot.config.emojis.arrows.down,
			customId: "rob",
			style: 2
		}]
	}

	if (data.guild.leveling.enabled === "true" && !user.bot) components[0].components.push({
		type: 2,
		emoji: bot.config.emojis.arrows.up,
		label: await message.translate("Rank"),
		customId: "rank",
		style: 2
	})

	const msg = await message.replyT({
		embeds: [infoEmbed],
		components,
		fetchReply: true
	});

	/* -------------------------------------------------- HANDLE BUTTONS --------------------------------------------------*/
	const collector = msg.createMessageComponentCollector({ time: 300 * 1000 });
	collector.on("collect", async (interaction: any) => {
		if (!interaction.deferred && !["rank", "rob"].includes(interaction.customId)) interaction.deferUpdate().catch((): any => { });

		switch (interaction.customId) {
			case "info": {
				/* -------------------------------------------------- INFO PAGE --------------------------------------------------*/
				msg.edit({ embeds: [infoEmbed], files: [] }).catch((): any => { });
				break;
			} case "backpack": {
				/* -------------------------------------------------- BACKPACK PAGE --------------------------------------------------*/
				const inventory = Object.keys(userData.inventory).filter(i => userData.inventory[i] > 0).map(item => {
					const itemData = bot.shop.filter((i: any) => i.name === item).first();
					return `> **${itemData.emoji} ${item.charAt(0).toUpperCase() + item.slice(1)}** x${userData.inventory[item].toString()} [${itemData.ids.join(", ")}]\n> ⏣${itemData.price} - ${itemData.description || "This item has no description."}`;
				}).join("\n\n");

				msg.edit({
					embeds: [{
						title: `${bot.config.emojis.backpack} ${await message.translate("Backpack")}`,
						description: `**${bot.config.emojis.folder} Balance**\n> ${bot.config.emojis.coin} Wallet: ⏣${bot.functions.formatNumber(userData.money.balance)}\n> ${bot.config.emojis.bank} Bank: ⏣${bot.functions.formatNumber(userData.money.bank)}/${bot.functions.formatNumber(userData.money.bankMax)}\n\n**${bot.config.emojis.folder} Items [${Object.keys(userData.inventory).length}]**\n${Object.keys(userData.inventory).length > 0 ? inventory : `> ${await message.translate(`${bot.config.emojis.alert} | This user has no items in their backpack.`)}`}`,
						color: user.accentColor || Colors.Blue,
						timestamp: new Date(),
						thumbnail: { url: (user.user ? user.user : user).displayAvatarURL() }
					}],
					files: []
				})

				break;
			} case "mod_history": {
				/* -------------------------------------------------- MODERATION HISTORY --------------------------------------------------*/
				const warnings = memberData.infractions
					.sort((a: any, b: any) => b.date - a.date)
					.map((infraction: any) => `> **${infraction.type}** - <t:${~~(infraction.date / 1000)}:R>`)
					.join("\n");

				msg.edit({
					embeds: [{
						title: `${bot.config.emojis.ban} ${await message.translate("Moderation History")} [${memberData.infractions.length}]`,
						description: `${memberData.infractions.length > 0 ? warnings : `> ${await message.translate(`${bot.config.emojis.alert} | This user has no moderation history. Now that's a clean record!`)}`}`,
						color: user.accentColor || Colors.Blue,
						timestamp: new Date(),
						thumbnail: { url: (user.user ? user.user : user).displayAvatarURL() },
						image: { url: null }
					}],
					files: []
				});
				break;
			} case "rank": {
				/* -------------------------------------------------- RANK PAGE --------------------------------------------------*/
				await interaction.reply({
					files: [new Discord.AttachmentBuilder(rankImage).setName(`rank.png`)],
					ephemeral: true
				});
				break;
			} case "rob": {
				if (!cooldowns[interaction.user.id]) cooldowns[interaction.user.id] = [];
				const time = cooldowns[interaction.user.id]["rob"] || 0;
				if (time && (time > Date.now())) return await interaction.reply({
					embeds: [{
						author: {
							name: interaction.user.tag,
							icon_url: interaction.user.displayAvatarURL()
						},
						title: `${bot.config.emojis.error} | Whoa there ${interaction.user.username}!`,
						description: `Please wait **${((time - Date.now()) / 1000 % 60).toFixed(2)} **more seconds to use that command again.`,
						thumbnail: { url: interaction.user.displayAvatarURL() },
						color: Colors.Red,
						timestamp: new Date()
					}]
				});

				cooldowns[interaction.user.id]["rob"] = Date.now() + 60 * 1000;

				/* -------------------------------------------------- ROB PAGE --------------------------------------------------*/
				const areYouSure = await interaction.reply({
					embeds: [{
						author: {
							name: message.user.tag,
							iconURL: message.user.displayAvatarURL()
						},
						description: `${bot.config.emojis.alert} | Are you sure you'd like to rob ${user}? Please select below \`yes\` or \`no\` to continue.`,
						color: Colors.Red
					}],
					components: [{
						type: 1,
						components: [{
							type: 2,
							emoji: bot.config.emojis.success,
							label: "Yes",
							style: 3,
							customId: "yes"
						}, {
							type: 2,
							emoji: bot.config.emojis.error,
							label: "No",
							style: 4,
							customId: "no"
						}]
					}],
					fetchReply: true
				});

				const collector = areYouSure.createMessageComponentCollector({
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
						await areYouSure.edit({
							embeds: [{
								author: {
									name: message.user.tag,
									iconURL: message.user.displayAvatarURL()
								},
								description: `${bot.config.emojis.alert} | You have chosen to not to rob ${user}.`,
								color: Colors.Red
							}],
							fetchReply: true
						});
					} else {
						const updatedAuthorData = await bot.database.getUser(interaction.user.id);
						const updatedUserData = await bot.database.getUser(user.id);

						const odds: number = Math.floor(Math.random() * 100) + 1;
						const Embed: any = {
							author: {
								name: message.user.tag,
								icon_url: message.user.displayAvatarURL()
							},
							fields: [{
								name: "Want More?",
								value: "Get an extra ⏣25,000 by voting for SparkV [here](https://top.gg/bot/884525761694933073/vote)!",
								inline: true
							}],
							color: Colors.Green,
							timestamp: new Date()
						}

						let amount;
						if (odds <= 60) {
							updatedAuthorData.money.balance -= 250;
							updatedUserData.money.balance += 250;

							Embed.title = `**You got caught!**`;
							Embed.description = `Uh oh! You got caught and paid **⏣250** to ${user}. You now have ⏣${await bot.functions.formatNumber(updatedAuthorData.money.balance)} coins.`;
							Embed.color = Colors.Red;
						} else if (odds > 60 && odds <= 80) {
							amount = Math.floor(updatedAuthorData.money.balance * 0.25);

							updatedAuthorData.money.balance += amount;
							updatedUserData.money.balance -= amount;

							Embed.title = `**Small Payout**`;
							Embed.description = `You got away with a **small amount** of **⏣${await bot.functions.formatNumber(amount)}**. You now have ⏣${await bot.functions.formatNumber(updatedAuthorData.money.balance)} coins!`;
						} else if (odds > 80 && odds <= 100) {
							amount = Math.floor(updatedAuthorData.money.balance * 0.5);

							updatedAuthorData.money.balance += amount;
							updatedUserData.money.balance -= amount;

							Embed.title = `**Large Payout**`;
							Embed.description = `You managed to steal a **large amount** of **⏣${await bot.functions.formatNumber(amount)}**. Great job! You now have ⏣${await bot.functions.formatNumber(updatedAuthorData.money.balance)} coins!`;
						} else {
							amount = Math.round(updatedAuthorData.money.balance);

							updatedAuthorData.money.balance += updatedUserData.money.balance;
							updatedUserData.money.balance -= updatedUserData.money.balance;

							Embed.title = `**FULL PAYOUT!**`;
							Embed.description = `YOU GOT AWAY WITH **ALL ⏣${await bot.functions.formatNumber(amount)}** OF THEIR MONEY LOL. Honestly, they should have protected their coins in their bank. You now have ⏣${await bot.functions.formatNumber(updatedAuthorData.money.balance)} coins!`;
						}

						updatedUserData.markModified("money.balance")
						await updatedUserData.save();
						updatedAuthorData.markModified("money.balance")
						await updatedAuthorData.save();

						await areYouSure.edit({ embeds: [Embed], components: [] });
					}
				});
			}
		}
	});
	collector.on("end", async () => {
		try { await msg?.edit({ components: [] }); } catch (err: any) { }
	});

	// 	const avatar = user.displayAvatarURL({ dynamic: true, extension: "png" });
	// 	embed
	// 		.setDescription(`[32px](${avatar}?size=32) | [64px](${avatar}?size=64) | [128px](${avatar}?size=128) | [256px](${avatar}?size=256) | [512px](${avatar}?size=512) | [1024px](${avatar}?size=1024)\n[png](${avatar.replace(".gif", ".png")}) | [jpg](${avatar.replace(".png", ".jpg").replace(".gif", ".jpg")}) | [gif](${avatar.replace(".png", ".gif")})`)
	// 		.setThumbnail(`${avatar}?size=512`)
	// 		.setColor(Colors.Blue);

	// 	return message.replyT({
	// 		embeds: [embed]
	// 	});
	// }

	/*
		Function handleAnimated(url) {
			if (url.includes("a_")) return url.replace(".png", ".gif");
		}

		let invite = data.options.getString("invite") || null;
		const icon = message.options.getString("icon");
		const embed = new Discord.EmbedBuilder()
			.setAuthor({
				name: `${message.guild.name} (${message.guild.id})`,
				iconURL: message.guild.iconURL({ dynamic: true, extension: "png" })
			});

		if (icon === "yes") {
			const guildIcon = message.guild.iconURL({ dynamic: true, extension: "png" });

			embed
				.setDescription(`[32px](${guildIcon}?size=32) | [64px](${guildIcon}?size=64) | [128px](${guildIcon}?size=128) | [256px](${guildIcon}?size=256) | [512px](${guildIcon}?size=512) | [1024px](${guildIcon}?size=1024)\n[png](${guildIcon.replace(".gif", ".png")}) | [jpg](${guildIcon.replace(".png", ".jpg").replace(".gif", ".jpg")}) | [gif](${guildIcon.replace(".png", ".gif")})`)
				.setThumbnail(`${guildIcon}?size=512`)
				.setColor(Colors.Blue);

			await message.replyT({
				embeds: [embed]
			});
		} else {
			const VerificationLevels = {
				NONE: {
					emoji: "🔓",
					desc: "None."
				},
				LOW: {
					emoji: "🟢",
					desc: "must have verified email on account"
				},
				MEDIUM: {
					emoji: "🟡",
					desc: "must be registered on Discord for longer than 5 minutes"
				},
				HIGH: {
					emoji: "🟠",
					desc: "must be a member of the server for longer than 10 minutes"
				},
				VERY_HIGH: {
					emoji: "🔴",
					desc: "must have a verified phone number"
				}
			};

			const premiumTier = {
				NONE: {
					emoji: bot.config.emojis.error,
					desc: "None."
				},
				TIER_1: {
					emoji: "🟢",
					desc: "Tier 1"
				},
				TIER_2: {
					emoji: "🟡",
					desc: "Tier 2"
				},
				TIER_3: {
					emoji: "🟠",
					desc: "Tier 3"
				}
			};

			const explicitContentFilterLevels = {
				DISABLED: bot.config.emojis.error,
				MEMBERS_WITHOUT_ROLES: "Enabled for members without a role.",
				ALL_MEMBERS: "Enabled for all users, no matter the role."
			};

			if (invite) {
				invite = invite.match(/(?:https?:\/\/)?(?:\w+\.)?discord(?:(?:app)?\.com\/invite|\.gg)\/([A-Za-z0-9-]+)/);

				let fixedInvite;
				if (!invite?.[0]) fixedInvite = invite;
				else fixedInvite = invite[1];

				if (!fixedInvite) return await message.replyT("Please enter a valid invite.");

				const serverinfo = await axios
					.get(`https://discord.com/api/v8/invites/${fixedInvite}?with_counts=1&with_expiration=1`)
					.then(res => res.data);

				if (serverinfo.code === 400) return message.replyT("Invalid invite.");

				embed
					.setAuthor({
						name: `${serverinfo?.guild?.name} (${serverinfo?.guild?.id})`,
						iconURL: handleAnimated(`https://cdn.discordapp.com/icons/${serverinfo.guild.id}/${serverinfo.guild.icon}.png`)
					})
					.setTitle(serverinfo.guild.name)
					.addField("**Members**", `${serverinfo.approximate_member_count}`, true)
					.setURL(`https://discord.gg/${serverinfo.guild.vanity_url_code || fixedInvite}`)
					.setThumbnail(handleAnimated(`https://cdn.discordapp.com/icons/${serverinfo.guild.id}/${serverinfo.guild.icon}.png`))
					.setColor(Colors.Blue)
					.setFooter({
						text: bot.config.embed.footer,
						iconURL: bot.user.displayAvatarURL({ extension: "png" })
					});

				if (serverinfo.guild?.description || serverinfo.guild?.welcome_screen?.description) embed.setDescription(serverinfo?.guild?.description || serverinfo?.guild?.welcome_screen?.description);
				if (serverinfo.guild?.banner) embed.setImage(handleAnimated(`https://cdn.discordapp.com/banners/${serverinfo.guild.id}/${serverinfo.guild.banner}.png?size=1024`));
				if (serverinfo.guild?.vanity_url_code) embed.addField("**Vanity URL**", `https://discord.gg/${serverinfo.guild?.vanity_url_code}`, true);

				return await message.replyT({
					embeds: [embed]
				});
			}

			embed
				.setDescription(`${bot.config.emojis.owner} **Server Owner**: ${await message.guild?.fetchOwner() || "❗UNKNOWN"}\n${bot.config.emojis.plus} **Server Created**: <t:${~~(message.guild.createdAt / 1000)}:R>\n${bot.config.emojis.player} **Total Members**: ${message.guild.members.memberCount}\n\`🌿\` **Channels**: 📂 ${message.guild.channels.cache.filter(c => c.type === "GUILD_CATEGORY").size} | ${bot.config.emojis.channel} ${message.guild.channels.cache.size} | 🔊 ${message.guild.channels.cache.filter(c => c.type === "GUILD_VOICE").size}`)
				.addField("Security", `\`${VerificationLevels[message.guild.verificationLevel].emoji}\` **Verification Level**: ${VerificationLevels[message.guild.verificationLevel].desc}\n\`1️⃣\` **Notification Settings**: ${message.guild.defaultMessageNotifications === "ONLY_MENTIONS" ? "Only Mentions" : "All Messages"}\n\`🔎\` **Content Filter**: ${explicitContentFilterLevels[message.guild.explicitContentFilter] || bot.config.emojis.error}\n\`🔒\` **2FA Enabled**: ${message.guild.mfaLevel === "ELEVATED" ? bot.config.emojis.success : bot.config.emojis.error}`, true)
				.addField(`${bot.config.emojis.config} Other`, `😃 ${message.guild.emojis.cache.size} | 🏳️ ${message.guild.roles.cache.size}\n${message.guild?.vanity_url_code ? `\`🌐\` **Vanity URL**: https://discord.gg/${message.guild.vanity_url_code}\n` : ""}\`🔧\` **Region**: ${message.guild.preferredLocale}\n\`🔮\` **Premium Tier**: ${message.guild.premiumTier ? `${premiumTier[message.guild.premiumTier].emoji || ""} ${premiumTier[message.guild.premiumTier].desc}` : "None"}`, true)
				.setThumbnail(message.guild.iconURL({ dynamic: true }))
				.setFooter({
					text: `🔢 ID: ${message.guild.id} • ${bot.config.embed.footer}`,
					iconURL: bot.user.displayAvatarURL()
				})
				.setColor("GREEN");

			if (message.guild?.welcome_screen?.description) embed.setDescription(message.guild.welcome_screen.description);
			if (message.guild?.banner) embed.setImage(`https://cdn.discordapp.com/banners/${message.guild.id}/${message.guild.banner}.png?size=1024`);
			if (message.guild?.vanity_url_code) embed.setURL(`https://discord.gg/${message.guild.vanityURLCode}`);

			const serverIcon = new Discord.ButtonBuilder()
				.setLabel(await message.translate("Server Icon"))
				.setEmoji("🖼️")
				.setStyle(5)
				.setURL(message.guild.iconURL({ dynamic: true }) || "https://cdn.discordapp.com/embed/avatars/1.png");

			const bannerButton = new Discord.ButtonBuilder()
				.setLabel(await message.translate("Banner"))
				.setEmoji("🏳️")
				.setStyle(5)
				.setURL(`https://cdn.discordapp.com/banners/${message.guild.id}/${message.guild.banner}.png?size=1024`);

			const buttons = new Discord.MessageActionRow();
			buttons.addComponents(serverIcon);

			if (message.guild?.banner) buttons.addComponents(bannerButton);

			await message.replyT({
				embeds: [embed],
				components: [buttons]
			});
		}
	*/
}

export default new cmd(execute, {
	description: "Get information about a user or server. (user/rank/balance/inventory/icon)",
	dirname: __dirname,
	usage: "(user/rank/balance/inventory/icon)",
	aliases: [],
	perms: [],
	slash: true,
	options: [{
		type: 6,
		name: "user",
		description: "The user to get the information of. Leave blank to get your info."
	}]
});
