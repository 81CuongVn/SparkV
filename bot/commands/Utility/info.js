const Discord = require("discord.js");

const cmd = require("@templates/command");

function capFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function handleAnimated(url) {
	if (url.includes("a_")) return url.replace(".png", ".gif");
}

async function execute(bot, message, args, command, data) {
	const state = message.options.getSubcommand();

	if (state === "user") {
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
			DISCORD_CERTIFIED_MODERATOR: "<:moderator:943240444777730068>",
		};

		let user = data.options.getUser("user") || message.user;
		const member = message.channel.guild.members.cache.get(user.id);

		const userdata = await bot.database.getUser(user.id);

		user = user.user ? await user.user.fetch() : await user.fetch();

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

		const position = new Promise(forfill => {
			for (let i = 1; i < members.length + 1; i++) {
				if (members[i - 1].id === member.id) forfill(i);
			}
		});

		const InfoEmbed = new Discord.MessageEmbed()
			.setAuthor({
				name: `${user.user ? user.user.tag : user.tag} (${(user.user ? user.user.bot : user.bot) ? "Robot" : "Human"})`,
				iconURL: (user.user ? user.user : user).displayAvatarURL({ dynamic: true }),
			})
			.setThumbnail((user.user ? user.user : user).displayAvatarURL({ dynamic: true }))
			.addField(`${statuses[member?.presence?.status || "offline"]} Presence`, `\`\`\`${member?.presence?.status === "dnd" ? "Do Not Disturb" : (member?.presence?.status ? capFirstLetter(member?.presence?.status) : "None")}\`\`\``, true)
			.addField(`${bot.config.emojis.clock} Join Position`, `\`\`\`${await position || "UNKNOWN"}/${members.length}\`\`\``, true)
			.setFooter({
				text: bot.config.embed.footer,
				iconURL: bot.user.displayAvatarURL({ dynamic: true })
			})
			.setColor(roleColor || bot.config.embed.color);

		if (user.flags.toArray().length > 0) InfoEmbed.addField(`${bot.config.emojis.award} Badges`, `${user.flags.toArray().map(b => badges[b] ? badges[b] : b)}`, false);

		InfoEmbed
			.addField(`${bot.config.emojis.plus} Registered`, `<t:${~~(user.createdAt / 1000)}:R>`, true)
			.addField(`${bot.config.emojis.join} Joined Server`, `<t:${~~(member.joinedAt / 1000)}:R>`, true);

		if (roles) InfoEmbed.addField(`${bot.config.emojis.trophy} Roles (${roleCount})`, roles, false);

		if (user.user ? user.user.banner : user.banner) InfoEmbed.setImage(user.user ? user.user.bannerURL({ dynamic: true, size: 1024 }) : user.bannerURL({ dynamic: true, size: 1024 }));

		await message.replyT({
			embeds: [InfoEmbed],
		});
	} else if (state === "server") {
		const VerificationLevels = {
			NONE: {
				emoji: "🔓",
				desc: "None.",
			},
			LOW: {
				emoji: "🟢",
				desc: "must have verified email on account",
			},
			MEDIUM: {
				emoji: "🟡",
				desc: "must be registered on Discord for longer than 5 minutes",
			},
			HIGH: {
				emoji: "🟠",
				desc: "must be a member of the server for longer than 10 minutes",
			},
			VERY_HIGH: {
				emoji: "🔴",
				desc: "must have a verified phone number",
			}
		};

		const premiumTier = {
			NONE: {
				emoji: bot.config.emojis.error,
				desc: "None.",
			},
			TIER_1: {
				emoji: "🟢",
				desc: "Tier 1",
			},
			TIER_2: {
				emoji: "🟡",
				desc: "Tier 2",
			},
			TIER_3: {
				emoji: "🟠",
				desc: "Tier 3",
			}
		};

		const explicitContentFilterLevels = {
			DISABLED: bot.config.emojis.error,
			MEMBERS_WITHOUT_ROLES: "Enabled for members without a role.",
			ALL_MEMBERS: "Enabled for all users, no matter the role."
		};

		let invite = (message?.applicationId ? data.options.getString("invite") : args[0]) || null;

		if (invite) {
			invite = invite.match(/(?:https?:\/\/)?(?:\w+\.)?discord(?:(?:app)?\.com\/invite|\.gg)\/([A-Za-z0-9-]+)/);

			let fixedInvite;
			if (!invite?.[0]) {
				fixedInvite = invite;
			} else {
				fixedInvite = invite[1];
			}

			if (!fixedInvite) return await message.replyT("Please enter a valid invite.");

			const serverinfo = await axios
				.get(`https://discord.com/api/v8/invites/${fixedInvite}?with_counts=1&with_expiration=1`)
				.then(res => res.data);

			if (serverinfo.code === 400) return message.replyT("Invalid invite.");

			const serverEmbed = new Discord.MessageEmbed()
				.setAuthor({
					name: `Server Info`,
					iconURL: bot.user.displayAvatarURL({ format: "png" }),
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

			if (serverinfo.guild?.description || serverinfo.guild?.welcome_screen?.description) serverEmbed.setDescription(serverinfo.guild.description);
			if (serverinfo.guild?.banner) serverEmbed.setImage(handleAnimated(`https://cdn.discordapp.com/banners/${serverinfo.guild.id}/${serverinfo.guild.banner}.png?size=1024`));
			if (serverinfo.guild?.vanity_url_code) serverEmbed.addField("**Vanity URL**", `https://discord.gg/${serverinfo.guild.vanity_url_code}`, true);

			return await message.replyT({
				embeds: [serverEmbed],
			});
		}

		const Basic = new Discord.MessageEmbed()
			.setAuthor({
				name: `${message.guild.name}`,
				iconURL: `${message?.guild?.iconURL({ dynamic: true }) || "https://cdn.discordapp.com/embed/avatars/1.png"}`,
			})
			.setDescription(`${bot.config.emojis.owner} **Server Owner**: ${await message.guild?.fetchOwner() || "❗UNKNOWN"}\n${bot.config.emojis.plus} **Server Created**: <t:${~~(message.guild.createdAt / 1000)}:R>\n${bot.config.emojis.player} **Total Members**: ${message.guild.memberCount}\n\`🌿\` **Channels**: 📂 ${message.guild.channels.cache.filter(c => c.type === "GUILD_CATEGORY").size} | ${bot.config.emojis.channel} ${message.guild.channels.cache.size} | 🔊 ${message.guild.channels.cache.filter(c => c.type === "GUILD_VOICE").size}`)
			.addField("Security", `\`${VerificationLevels[message.guild.verificationLevel].emoji}\` **Verification Level**: ${VerificationLevels[message.guild.verificationLevel].desc}\n\`1️⃣\` **Notification Settings**: ${message.guild.defaultMessageNotifications === "ONLY_MENTIONS" ? "Only Mentions" : "All Messages"}\n\`🔎\` **Content Filter**: ${explicitContentFilterLevels[message.guild.explicitContentFilter] || bot.config.emojis.error}\n\`🔒\` **2FA Enabled**: ${message.guild.mfaLevel === "ELEVATED" ? bot.config.emojis.success : bot.config.emojis.error}`, true)
			.addField(`${bot.config.emojis.config} Other`, `😃 ${message.guild.emojis.cache.size} | 🏳️ ${message.guild.roles.cache.size}\n${message.guild?.vanity_url_code ? `\`🌐\` **Vanity URL**: https://discord.gg/${message.guild.vanity_url_code}\n` : ""}\`🔧\` **Region**: ${message.guild.preferredLocale}\n\`🔮\` **Premium Tier**: ${message.guild.premiumTier ? `${premiumTier[message.guild.premiumTier].emoji || ""} ${premiumTier[message.guild.premiumTier].desc}` : "None"}`, true)
			.setThumbnail(message.guild.iconURL({ dynamic: true }))
			.setFooter({
				text: `🔢 ID: ${message.guild.id} • ${bot.config.embed.footer}`,
				iconURL: bot.user.displayAvatarURL({ dynamic: true })
			})
			.setColor("GREEN");

		if (message.guild?.welcome_screen?.description) Basic.setDescription(message.guild.welcome_screen.description);
		if (message.guild?.banner) Basic.setImage(`https://cdn.discordapp.com/banners/${message.guild.id}/${message.guild.banner}.png?size=1024`);
		if (message.guild?.vanity_url_code) Basic.setURL(`https://discord.gg/${message.guild.vanityURLCode}`);

		const serverIcon = new Discord.MessageButton()
			.setLabel("Server Icon")
			.setEmoji("🖼️")
			.setStyle("LINK")
			.setURL(message.guild.iconURL({ dynamic: true }) || "https://cdn.discordapp.com/embed/avatars/1.png");

		const bannerButton = new Discord.MessageButton()
			.setLabel("Banner")
			.setEmoji("🏳️")
			.setStyle("LINK")
			.setURL(`https://cdn.discordapp.com/banners/${message.guild.id}/${message.guild.banner}.png?size=1024`);

		const buttons = new Discord.MessageActionRow();
		buttons.addComponents(serverIcon);

		if (message.guild?.banner) buttons.addComponents(bannerButton);

		await message.replyT({
			embeds: [Basic],
			components: [buttons]
		});
	}
}

module.exports = new cmd(execute, {
	description: "See information about a user or server.",
	dirname: __dirname,
	usage: "(user)",
	aliases: ["ui"],
	perms: [],
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 1,
			name: "server",
			description: "Get the information of a server.",
			options: [
				{
					type: 3,
					name: "invite",
					description: "The invite of the server. Leave blank to get the info of the current server."
				}
			]
		},
		{
			type: 1,
			name: "user",
			description: "Get the information of a user.",
			options: [
				{
					type: 6,
					name: "user",
					description: "The user to get the information of. Leave blank to get your info."
				}
			]
		}
	]
});
