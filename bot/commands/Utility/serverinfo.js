const Discord = require("discord.js");
const axios = require("axios");

const cmd = require("../../templates/command");

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
		emoji: "❌",
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
	DISABLED: "❌",
	MEMBERS_WITHOUT_ROLES: "Enabled for members without a role.",
	ALL_MEMBERS: "Enabled for all users, no matter the role."
};

function handleAnimated(url) {
	if (url.includes("a_")) return url.replace(".webp", ".gif");
}

async function execute(bot, message, args, command, data) {
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
			name: `${message.guild.name} | Basic Information`,
			iconURL: `${message?.guild?.iconURL({ dynamic: true }) || "https://cdn.discordapp.com/embed/avatars/1.png"}`,
		})
		.setDescription(`
			\`👑\` **Server Owner**: ${await message.guild?.fetchOwner() || "❗UNKNOWN"}
			\`💡\` **Server Created**: <t:${~~(message.guild.createdAt / 1000)}:R>
			\`👥\` **Total Members**: ${message.guild.memberCount}\n
		`)
		.addField(`
			\`#️⃣\`**Channels**`, `
			\`📂\` **Categories**: ${message.guild.channels.cache.filter(c => c.type === "GUILD_CATEGORY").size}
			\`#️⃣\` **Text**: ${message.guild.channels.cache.size}
			\`🔊\` **Voice**: ${message.guild.channels.cache.filter(c => c.type === "GUILD_VOICE").size}
		`, true)
		.addField(`\`#️⃣\`**Assets**`, `
			\`🖼️\` [Server Icon](${message.guild.iconURL({ dynamic: true })})\n${message.guild.banner ? `\`🖼️\` [Server Banner](${handleAnimated(`https://cdn.discordapp.com/banners/${message.guild.id}/${message.guild.banner}.png?size=1024`)})` : ""}
		`, true)
		.addField(`\`⚙️\`**Other**`, `
			\`😃\` **Emojis**: ${message.guild.emojis.cache.size}
			\`🏳️\` **Roles**: ${message.guild.roles.cache.size}\n${message.guild?.vanity_url_code ? `\`🌐\` **Vanity URL**: https://discord.gg/${message.guild.vanity_url_code}` : ""}
		`, true)
		.setThumbnail(message.guild.iconURL({ dynamic: true }))
		.setFooter({
			text: `🔢 ID: ${message.guild.id} • ${bot.config.embed.footer}`,
			iconURL: bot.user.displayAvatarURL({ dynamic: true })
		})
		.setColor("GREEN");

	if (message.guild?.welcome_screen?.description) Basic.setDescription(message.guild.welcome_screen.description);
	if (message.guild?.banner) Basic.setImage(`https://cdn.discordapp.com/banners/${message.guild.id}/${message.guild.banner}.png?size=1024`);
	if (message.guild?.vanity_url_code) Basic.setURL(`https://discord.gg/${message.guild.vanityURLCode}`);

	const Security = new Discord.MessageEmbed()
		.setAuthor({
			name: `${message.guild.name} | Security Information`,
			iconURL: `${message?.guild?.iconURL({ dynamic: true }) || "https://cdn.discordapp.com/embed/avatars/1.png"}`,
		})
		.setDescription(`
			\`${VerificationLevels[message.guild.verificationLevel].emoji}\` **Verification Level**: ${VerificationLevels[message.guild.verificationLevel].desc}
			\`1️⃣\` **Notification Settings**: ${message.guild.defaultMessageNotifications === "ONLY_MENTIONS" ? "Only Mentions" : "All Messages"}
			\`🔎\` **Content Filter**: ${explicitContentFilterLevels[message.guild.explicitContentFilter] || "❌"}
			\`🔒\` **2FA Enabled**: ${message.guild.mfaLevel === "ELEVATED" ? "✅" : "❌"}
		`)
		.setThumbnail(message.guild.iconURL({ dynamic: true }))
		.setFooter({
			text: `🔢 ID: ${message.guild.id} • ${bot.config.embed.footer}`,
			iconURL: bot.user.displayAvatarURL({ dynamic: true })
		})
		.setColor("BLUE");

	const Other = new Discord.MessageEmbed()
		.setAuthor({
			name: `${message.guild.name} | Other Information`,
			iconURL: `${message?.guild?.iconURL({ dynamic: true }) || "https://cdn.discordapp.com/embed/avatars/1.png"}`,
		})
		.setDescription(`
			\`🔮\` **Premium Tier**: ${message.guild.premiumTier ? `${premiumTier[message.guild.premiumTier].emoji || ""} ${premiumTier[message.guild.premiumTier].desc}` : "None"}
		`)
		.setThumbnail(message.guild.iconURL({ dynamic: true }))
		.setFooter({
			text: `🔢 ID: ${message.guild.id} • ${bot.config.embed.footer}`,
			iconURL: bot.user.displayAvatarURL({ dynamic: true })
		})
		.setColor("GREY");

	const pages = [];
	pages.push(Basic);
	pages.push(Security);
	pages.push(Other);

	const basicButton = new Discord.MessageButton()
		.setLabel("Basic")
		.setEmoji("ℹ️")
		.setCustomId("basic_0")
		.setStyle("PRIMARY");

	const securityButton = new Discord.MessageButton()
		.setLabel("Security")
		.setEmoji("🛡️")
		.setCustomId("security_1")
		.setStyle("PRIMARY");

	const otherButton = new Discord.MessageButton()
		.setLabel("Other")
		.setEmoji("⚙️")
		.setCustomId("other_2")
		.setStyle("PRIMARY");

	const Menu = await message.replyT({
		embeds: [Basic],
		components: [
			new Discord.MessageActionRow().addComponents(basicButton, securityButton, otherButton)
		],
		fetchReply: true
	});

	const collector = Menu.createMessageComponentCollector({
		filter: interaction => {
			if (!interaction.deferred) interaction.deferUpdate();

			return true;
		}, time: 300 * 1000
	});

	collector.on("collect", async interaction => {
		await Menu.edit({
			embeds: [
				pages[interaction.customId.split("_")[1]]
			],
			components: [
				new Discord.MessageActionRow().addComponents(basicButton, securityButton, otherButton),
			],
		});
	});

	collector.on("end", async () => {
		try {
			await Menu?.edit({
				components: [basicButton.setDisabled(true), securityButton.setDisabled(true), otherButton.setDisabled(true)],
			});
		} catch (err) {
			console.error(err);
			// Do nothing. This is just to stop errors from going into the console. It's mostly for the case where the message is deleted.
		}
	});
}

module.exports = new cmd(execute, {
	description: "I will get the current server's info or any server's info by the invite link!",
	dirname: __dirname,
	aliases: ["server"],
	usage: `(optional: invite default: current server)`,
	slash: true,
	options: [
		{
			type: 3,
			name: "invite",
			description: "The invite of the server to get the server information from."
		}
	]
});
