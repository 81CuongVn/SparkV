import Discord, { GuildMember, Role } from "discord.js";
import canvacord from "canvacord";

import cmd from "../../../structures/command";

const statuses: any = {
	online: "<:online:948002054029340733>", idle: "<:idle:948003685118664784>",
	dnd: "<:dnd:948003123308396624>", offline: "<:offline:948002054247432202>"
};

const badges: any = {
	HOUSE_BRAVERY: "<:house_bravery:941439956528803860>", HOUSE_BRILLIANCE: "<:house_brilliance:941439956507840543>",
	HOUSE_BALANCE: "<:house_balance:941440238486691921>", DISCORD_CERTIFIED_MODERATOR: "<:moderator:943240444777730068>"
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
		fields: [
			{
				name: `${bot.config.emojis.player} ${await message.translate("User")} ${user.flags.toArray().length > 0 && user.flags.toArray().map((b: any) => badges[b as keyof typeof badges] ? badges[b as keyof typeof badges] : b)}`,
				value: `\`\`\`${user?.tag}\`\`\``,
				inline: true
			},
			{
				name: `${statuses[member?.presence?.status || "offline"]} ${await message.translate("Presence")}`,
				value: `\`\`\`${member?.presence?.status === "dnd" ? "Do Not Disturb" : (member?.presence?.status ? (member?.presence?.status.charAt(0).toUpperCase() + member?.presence?.status.slice(1)) : "Offline")}\`\`\``,
				inline: true
			},
			{
				name: `${bot.config.emojis.id} ${await message.translate("ID")}`,
				value: `\`\`\`${user?.id}\`\`\``,
				inline: false
			},
			{
				name: `${bot.config.emojis.plus} ${await message.translate("Registered")}`,
				value: `<t:${~~(user.createdAt / 1000)}:R>`,
				inline: true
			},
			{
				name: `${bot.config.emojis.join} ${await message.translate("Joined Server")}`,
				value: `<t:${~~(member.joinedAt / 1000)}:R>`,
				inline: true
			}
		],
		color: user.accentColor || bot.config.embed.color,
		timestamp: new Date(),
		thumbnail: { url: (user.user ? user.user : user).displayAvatarURL({ dynamic: true }) },
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
			.setAvatar(member.displayAvatarURL({ dynamic: false, format: "png" }))
			.setStatus(member?.presence?.status || "offline", false)
			.setRank(leaderboard.findIndex((i: any) => i.guildID === message.guild.id && i.id === (member.user ? member.user.id : member.id)) + 1)
			.setLevel(memberData.level || 0)
			.setCurrentXP(memberData.xp || 0)
			.setRequiredXP(((parseInt(memberData.level) + 1) * (parseInt(memberData.level) + 1) * 100) || 100)
			.setProgressBar(`#0099ff`, `COLOR`);

		rankImage = await Rank.build().then(data => data)
	};

	/* -------------------------------------------------- SEND MESSAGE --------------------------------------------------*/
	const msg = await message.replyT({
		embeds: [infoEmbed],
		components: [{
			type: 1,
			components: [
				{
					type: 2,
					label: await message.translate("Avatar"),
					emoji: bot.config.emojis.image,
					style: "LINK",
					url: (user.user ? user.user : user).displayAvatarURL({ dynamic: true, size: 1024 })
				}, {
					type: 2,
					emoji: bot.config.emojis.info,
					label: await message.translate("General"),
					customId: "info",
					style: "SECONDARY",
				}, {
					type: 2,
					emoji: bot.config.emojis.backpack,
					label: await message.translate("Backpack"),
					customId: "backpack",
					style: "SECONDARY",
				}, {
					type: 2,
					emoji: bot.config.emojis.arrows.up,
					label: await message.translate("Rank"),
					customId: "rank",
					style: "SECONDARY",
				}, {
					type: 2,
					emoji: bot.config.emojis.ban,
					label: await message.translate("Moderation History"),
					customId: "mod_history",
					style: "SECONDARY",
				}]
		}],
		fetchReply: true
	});

	/* -------------------------------------------------- HANDLE BUTTONS --------------------------------------------------*/
	const collector = msg.createMessageComponentCollector({ time: 300 * 1000 });
	collector.on("collect", async (interaction: any) => {
		if (!interaction.deferred) interaction.deferUpdate().catch((): any => { });

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
						color: user.accentColor || bot.config.embed.color,
						timestamp: new Date(),
						thumbnail: { url: (user.user ? user.user : user).displayAvatarURL({ dynamic: true }) }
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
						color: user.accentColor || bot.config.embed.color,
						timestamp: new Date(),
						thumbnail: { url: (user.user ? user.user : user).displayAvatarURL({ dynamic: true }) },
						image: { url: null }
					}],
					files: []
				});
				break;
			} case "rank": {
				/* -------------------------------------------------- RANK PAGE --------------------------------------------------*/
				msg.edit({
					embeds: [{
						title: `${bot.config.emojis.arrows.up} ${await message.translate("Rank")}`,
						color: user.accentColor || bot.config.embed.color,
						timestamp: new Date(),
						image: { url: "attachment://rank.png" }
					}],
					files: data.guild.leveling.enabled === "true" ? [new Discord.MessageAttachment(rankImage, `rank.png`)] : []
				})
			}
		}
	});
	collector.on("end", async () => {
		try { await msg?.edit({ components: [] }); } catch (err: any) { }
	});

	// 	const avatar = user.displayAvatarURL({ dynamic: true, format: "png" });
	// 	embed
	// 		.setDescription(`[32px](${avatar}?size=32) | [64px](${avatar}?size=64) | [128px](${avatar}?size=128) | [256px](${avatar}?size=256) | [512px](${avatar}?size=512) | [1024px](${avatar}?size=1024)\n[png](${avatar.replace(".gif", ".png")}) | [jpg](${avatar.replace(".png", ".jpg").replace(".gif", ".jpg")}) | [gif](${avatar.replace(".png", ".gif")})`)
	// 		.setThumbnail(`${avatar}?size=512`)
	// 		.setColor(bot.config.embed.color);

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
		const embed = new Discord.MessageEmbed()
			.setAuthor({
				name: `${message.guild.name} (${message.guild.id})`,
				iconURL: message.guild.iconURL({ dynamic: true, format: "png" })
			});

		if (icon === "yes") {
			const guildIcon = message.guild.iconURL({ dynamic: true, format: "png" });

			embed
				.setDescription(`[32px](${guildIcon}?size=32) | [64px](${guildIcon}?size=64) | [128px](${guildIcon}?size=128) | [256px](${guildIcon}?size=256) | [512px](${guildIcon}?size=512) | [1024px](${guildIcon}?size=1024)\n[png](${guildIcon.replace(".gif", ".png")}) | [jpg](${guildIcon.replace(".png", ".jpg").replace(".gif", ".jpg")}) | [gif](${guildIcon.replace(".png", ".gif")})`)
				.setThumbnail(`${guildIcon}?size=512`)
				.setColor(bot.config.embed.color);

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
					.setColor(bot.config.embed.color)
					.setFooter({
						text: bot.config.embed.footer,
						iconURL: bot.user.displayAvatarURL({ format: "png" })
					});

				if (serverinfo.guild?.description || serverinfo.guild?.welcome_screen?.description) embed.setDescription(serverinfo?.guild?.description || serverinfo?.guild?.welcome_screen?.description);
				if (serverinfo.guild?.banner) embed.setImage(handleAnimated(`https://cdn.discordapp.com/banners/${serverinfo.guild.id}/${serverinfo.guild.banner}.png?size=1024`));
				if (serverinfo.guild?.vanity_url_code) embed.addField("**Vanity URL**", `https://discord.gg/${serverinfo.guild?.vanity_url_code}`, true);

				return await message.replyT({
					embeds: [embed]
				});
			}

			embed
				.setDescription(`${bot.config.emojis.owner} **Server Owner**: ${await message.guild?.fetchOwner() || "❗UNKNOWN"}\n${bot.config.emojis.plus} **Server Created**: <t:${~~(message.guild.createdAt / 1000)}:R>\n${bot.config.emojis.player} **Total Members**: ${message.guild.memberCount}\n\`🌿\` **Channels**: 📂 ${message.guild.channels.cache.filter(c => c.type === "GUILD_CATEGORY").size} | ${bot.config.emojis.channel} ${message.guild.channels.cache.size} | 🔊 ${message.guild.channels.cache.filter(c => c.type === "GUILD_VOICE").size}`)
				.addField("Security", `\`${VerificationLevels[message.guild.verificationLevel].emoji}\` **Verification Level**: ${VerificationLevels[message.guild.verificationLevel].desc}\n\`1️⃣\` **Notification Settings**: ${message.guild.defaultMessageNotifications === "ONLY_MENTIONS" ? "Only Mentions" : "All Messages"}\n\`🔎\` **Content Filter**: ${explicitContentFilterLevels[message.guild.explicitContentFilter] || bot.config.emojis.error}\n\`🔒\` **2FA Enabled**: ${message.guild.mfaLevel === "ELEVATED" ? bot.config.emojis.success : bot.config.emojis.error}`, true)
				.addField(`${bot.config.emojis.config} Other`, `😃 ${message.guild.emojis.cache.size} | 🏳️ ${message.guild.roles.cache.size}\n${message.guild?.vanity_url_code ? `\`🌐\` **Vanity URL**: https://discord.gg/${message.guild.vanity_url_code}\n` : ""}\`🔧\` **Region**: ${message.guild.preferredLocale}\n\`🔮\` **Premium Tier**: ${message.guild.premiumTier ? `${premiumTier[message.guild.premiumTier].emoji || ""} ${premiumTier[message.guild.premiumTier].desc}` : "None"}`, true)
				.setThumbnail(message.guild.iconURL({ dynamic: true }))
				.setFooter({
					text: `🔢 ID: ${message.guild.id} • ${bot.config.embed.footer}`,
					iconURL: bot.user.displayAvatarURL({ dynamic: true })
				})
				.setColor("GREEN");

			if (message.guild?.welcome_screen?.description) embed.setDescription(message.guild.welcome_screen.description);
			if (message.guild?.banner) embed.setImage(`https://cdn.discordapp.com/banners/${message.guild.id}/${message.guild.banner}.png?size=1024`);
			if (message.guild?.vanity_url_code) embed.setURL(`https://discord.gg/${message.guild.vanityURLCode}`);

			const serverIcon = new Discord.MessageButton()
				.setLabel(await message.translate("Server Icon"))
				.setEmoji("🖼️")
				.setStyle("LINK")
				.setURL(message.guild.iconURL({ dynamic: true }) || "https://cdn.discordapp.com/embed/avatars/1.png");

			const bannerButton = new Discord.MessageButton()
				.setLabel(await message.translate("Banner"))
				.setEmoji("🏳️")
				.setStyle("LINK")
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
	slashOnly: true,
	options: [
		{
			type: 6,
			name: "user",
			description: "The user to get the information of. Leave blank to get your info."
		}
	]
});
