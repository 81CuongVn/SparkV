const Discord = require("discord.js");
const axios = require("axios");

const cmd = require("../../templates/command");

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

		console.log(serverinfo);

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

	const Owner = await message.guild?.fetchOwner() || null;

	const serverEmbed = new Discord.MessageEmbed()
		.setAuthor({
			name: `${message.guild.name}`,
			iconURL: `${message?.guild?.iconURL({ dynamic: true }) || "https://cdn.discordapp.com/embed/avatars/1.png"}`,
		})
		.setDescription(`
			\`👑\` **Server Owner**: ${Owner || "❗UNKNOWN"}
			\`💡\` **Server Created**: <t:${~~(message.guild.createdAt / 1000)}:R>
			\`👥\` **Total Members**: ${message.guild.memberCount}\n
		`)
		.addField(`\`#️⃣\`**Channels**`, `
			\`📂\` **Categories**: ${message.guild.channels.cache.filter(c => c.type === "category").size}
			\`#️⃣\` **Text**: ${message.guild.channels.cache.size}
			\`🔊\` **Voice**: ${message.guild.channels.cache.filter(c => c.type === "voice").size}
		`, true)
		.addField(`\`#️⃣\`**Assets**`, `
			\`🖼️\` [Server Icon](${message.guild.iconURL({ dynamic: true })})\n${message.guild.banner ? `\`🖼️\` [Server Banner](${handleAnimated(`https://cdn.discordapp.com/banners/${message.guild.id}/${message.guild.banner}.png?size=1024`)})` : ""}
		`, true)
		.addField(`\`⚙️\`**Other**`, `
			\`😃\` **Emojis**: ${message.guild.emojis.cache.size}
			\`🏳️\` **Roles**: ${message.guild.roles.cache.size}\n${message.guild?.vanity_url_code ? `\`🌐\` **Vanity URL**: https://discord.gg/${message.guild.vanity_url_code}` : ""}
		`, true)
		.setThumbnail(message.guild.iconURL({ dynamic: true }))
		.setColor(bot.config.embed.color)
		.setFooter({
			text: `🔢 ID: ${message.guild.id} • ${bot.config.embed.footer}`,
			iconURL: bot.user.displayAvatarURL({ dynamic: true })
		});

	if (message.guild?.welcome_screen?.description) serverEmbed.setDescription(message.guild.welcome_screen.description);
	if (message.guild?.banner) serverEmbed.setImage(`https://cdn.discordapp.com/banners/${message.guild.id}/${message.guild.banner}.png?size=1024`);
	if (message.guild?.vanity_url_code) serverEmbed.setURL(`https://discord.gg/${message.guild.vanityURLCode}`);

	await message.replyT({
		embeds: [serverEmbed],
	});
}

module.exports = new cmd(execute, {
	description: "I will get the current server's info or any server's info by the invite link!",
	dirname: __dirname,
	aliases: ["server"],
	usage: `(optional: invite default: current server)`,
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 3,
			name: "invite",
			description: "The invite of the server to get the server information from."
		}
	]
});
