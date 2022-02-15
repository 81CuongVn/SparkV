const Discord = require("discord.js");
const axios = require("axios");

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	if (data.options.getString("invite")) {
		let invite = message?.applicationId ? data.options.getString("invite") : args[0];

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
			.setThumbnail(`https://cdn.discordapp.com/icons/${serverinfo.guild.id}/${serverinfo.guild.icon}.png`)
			.setColor(bot.config.embed.color)
			.setFooter({
				text: bot.config.embed.footer,
				iconURL: bot.user.displayAvatarURL({ format: "png" })
			});

		if (serverinfo.guild?.welcome_screen?.description) serverEmbed.setDescription(serverinfo.guild.welcome_screen.description);
		if (serverinfo.guild?.banner) serverEmbed.setImage(`https://cdn.discordapp.com/banners/${serverinfo.guild.id}/${serverinfo.guild.banner}.png?size=1024`);
		if (serverinfo.guild?.vanity_url_code) serverEmbed.addField("**Vanity URL**", `https://discord.gg/${serverinfo.guild.vanity_url_code}`, true);

		await message.replyT({
			embeds: [serverEmbed],
		});
	} else {
		const serverEmbed = new Discord.MessageEmbed()
			.setAuthor({
				name: `Server Info`,
				iconURL: bot.user.displayAvatarURL({ dynamic: true, format: "png" }),
			})
			.setTitle(message.guild.name)
			.addField("**Members**", `${message.guild.memberCount}`, true)
			.setThumbnail(message.guild.iconURL({ dynamic: true, format: "png" }))
			.setColor(bot.config.embed.color)
			.setFooter({
				text: bot.config.embed.footer,
				iconURL: bot.user.displayAvatarURL({ dynamic: true, format: "png" })
			});

		if (message.guild?.welcome_screen?.description) serverEmbed.setDescription(message.guild.welcome_screen.description);
		if (message.guild?.banner) serverEmbed.setImage(`https://cdn.discordapp.com/banners/${message.guild.id}/${message.guild.banner}.png?size=1024`);
		if (message.guild?.vanity_url_code) {
			serverEmbed
				.addField("**Vanity URL**", `https://discord.gg/${message.guild.vanity_url_code}`, true)
				.setURL(`https://discord.gg/${message.guild.vanityURLCode}`);
		}

		await message.replyT({
			embeds: [serverEmbed],
		});
	}
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
