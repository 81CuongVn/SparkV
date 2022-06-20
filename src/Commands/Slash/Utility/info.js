import Discord from "discord.js";
const canvacord = require("canvacord");

import cmd from "../../../structures/command";

async function execute(bot: any, message: any, args: string[], command: any, data: any) {
	const statuses = {
		online: "<:online:948002054029340733>",
		idle: "<:idle:948003685118664784>",
		dnd: "<:dnd:948003123308396624>",
		offline: "<:offline:948002054247432202>"
	};

	const badges = {
		HOUSE_BRAVERY: "<:house_bravery:941439956528803860>",
		HOUSE_BRILLIANCE: "<:house_brilliance:941439956507840543>",
		HOUSE_BALANCE: "<:house_balance:941440238486691921>",
		DISCORD_CERTIFIED_MODERATOR: "<:moderator:943240444777730068>"
	};

	let user = data.options.getUser("user") || message.user;
	const icon = message.options.getString("icon");
	const rank = message.options.getString("rank");
	const embed = new Discord.MessageEmbed()
		.setAuthor({
			name: `${user.tag} (${user.bot ? await message.translate("Robot") : await message.translate("Human")})`,
			iconURL: user.displayAvatarURL({ dynamic: true })
		})
		.setFooter({
			text: bot.config.embed.footer,
			iconURL: bot.user.displayAvatarURL({ dynamic: true })
		});

	if (icon === "yes") {
		const avatar = user.displayAvatarURL({ dynamic: true, format: "png" });

		embed
			.setDescription(`[32px](${avatar}?size=32) | [64px](${avatar}?size=64) | [128px](${avatar}?size=128) | [256px](${avatar}?size=256) | [512px](${avatar}?size=512) | [1024px](${avatar}?size=1024)\n[png](${avatar.replace(".gif", ".png")}) | [jpg](${avatar.replace(".png", ".jpg").replace(".gif", ".jpg")}) | [gif](${avatar.replace(".png", ".gif")})`)
			.setThumbnail(`${avatar}?size=512`)
			.setColor(bot.config.embed.color);

		return message.replyT({
			embeds: [embed]
		});
	} else if (rank === "yes") {
		if (data.guild.leveling.enabled === "false") return await message.replyT(`${bot.config.emojis.alert} | Leveling is disabled. Please ask a server admin, or server owner, to enable it on the \`/settings\` panel.`);

		const Target = data.options.getMember("user") || message.member;
		const TargetMember = await message.guild.members.fetch(Target.user ? Target.user.id : Target.id).catch(() => {});

		const userData = await bot.database.getMember(Target.user ? Target.user.id : Target.id, message.guild.id);

		const leaderboard = await bot.MemberSchema.find({
			guildID: message.guild.id
		}).sort([["xp", "descending"]]).exec();

		const Rank = new canvacord.Rank()
			.setUsername(Target.user ? Target.user.username : Target.username)
			.setDiscriminator(Target.user ? Target.user.discriminator : Target.discriminator)
			.setAvatar(Target.displayAvatarURL({ dynamic: false, format: "png" }))
			.setStatus(TargetMember?.presence?.status || "offline")
			.setRank(leaderboard.findIndex(i => i.guildID === message.guild.id && i.id === (Target.user ? Target.user.id : Target.id)) + 1)
			.setLevel(userData.level || 0)
			.setCurrentXP(userData.xp || 0)
			.setRequiredXP(((parseInt(userData.level) + 1) * (parseInt(userData.level) + 1) * 100) || 100)
			.setProgressBar(`#0099ff`, `COLOR`);

		Rank.build().then(async data => {
			const Attachment = new Discord.MessageAttachment(data, `RankCard.png`);

			return await message.replyT({
				files: [Attachment]
			});
		});
	} else {
		user = user.user ? await user.user.fetch().catch(err => {}) : await user.fetch().catch(err => {});
		const member = message.channel.guild.members.cache.get(user.id);

		let num = 0;
		let addedRoles = 0;
		let roleCount = 0;
		let plusRoles = false;
		let roleColor;
		let roles = member.roles.cache
			.sort((a, b) => b.comparePositionTo(a))
			.filter(r => r.id !== message.guild.id)
			.map((r, id) => {
				roleCount++;
				if (num === 0) roleColor = r.hexColor;

				if (num < 4) {
					num++;

					return `<@&${r.id}>`;
				} else {
					plusRoles = true;
					addedRoles++;
				}
			})
			.join(" ");

		if (plusRoles === true) roles += `+${addedRoles}`;

		const members = message.guild.members.cache
			.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
			.toJSON();

		const infoEmbed = new Discord.MessageEmbed()
			.setThumbnail((user.user ? user.user : user).displayAvatarURL({ dynamic: true }))
			.addField(`${bot.config.emojis.player} ${await message.translate("User")} ${user.flags.toArray().length > 0 && user.flags.toArray().map(b => badges[b] ? badges[b] : b)}`, `\`\`\`${user?.tag}\`\`\``, true)
			.addField(`${statuses[member?.presence?.status || "offline"]} ${await message.translate("Presence")}`, `\`\`\`${member?.presence?.status === "dnd" ? "Do Not Disturb" : (member?.presence?.status ? (member?.presence?.status.charAt(0).toUpperCase() + member?.presence?.status.slice(1)) : "Offline")}\`\`\``, true)
			.addField(`${bot.config.emojis.id} ${await message.translate("ID")}`, `\`\`\`${user?.id}\`\`\``, false)
			.setColor(roleColor || bot.config.embed.color)
			.setTimestamp();

		infoEmbed
			.addField(`${bot.config.emojis.plus} ${await message.translate("Registered")}`, `<t:${~~(user.createdAt / 1000)}:R>`, true)
			.addField(`${bot.config.emojis.join} ${await message.translate("Joined Server")}`, `<t:${~~(member.joinedAt / 1000)}:R>`, true);

		if (roles) infoEmbed.addField(`${bot.config.emojis.trophy} Roles (${roleCount})`, roles, false);
		if (user.user ? user.user.banner : user.banner) infoEmbed.setImage(user.user ? user.user.bannerURL({ dynamic: true, size: 1024 }) : user.bannerURL({ dynamic: true, size: 1024 }));

		return message.replyT({
			embeds: [infoEmbed]
		});
	}

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
	description: "Get information about a user or server. (user/rank/icon)",
	dirname: __dirname,
	usage: "(user/rank/icon)",
	aliases: ["ui"],
	perms: [],
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 6,
			name: "user",
			description: "The user to get the information of. Leave blank to get your info."
		},
		{
			type: 3,
			name: "rank",
			description: "Whether or not you want to view the rank of a user.",
			choices: [
				{
					name: "Yes",
					value: "yes"
				},
				{
					name: "No",
					value: "no"
				}
			]
		},
		{
			type: 3,
			name: "icon",
			description: "Whether or not you want to get the icon, and not the info of the user.",
			choices: [
				{
					name: "Yes",
					value: "yes"
				},
				{
					name: "No",
					value: "no"
				}
			]
		}
	]
});
