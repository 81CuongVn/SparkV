import Discord from "discord.js";

import cmd from "../../../structures/command";

async function execute(bot: any, message: any, args: string[], command: any, data: any) {
	const type = data.options.getString("type");
	const embed = new Discord.MessageEmbed()
		.setAuthor({
			name: bot.user.tag,
			iconURL: bot.user.displayAvatarURL({ dynamic: true })
		})
		.setTimestamp();

	if (type === "permissions") {
		const requiredPerms = [
			"KICK_MEMBERS",
			"BAN_MEMBERS",
			"MANAGE_CHANNELS",
			"MANAGE_GUILD",
			"ADD_REACTIONS",
			"VIEW_CHANNEL",
			"SEND_MESSAGES",
			"MANAGE_MESSAGES",
			"EMBED_LINKS",
			"ATTACH_FILES",
			"READ_MESSAGE_HISTORY",
			"USE_EXTERNAL_EMOJIS",
			"CONNECT",
			"SPEAK",
			"MANAGE_NICKNAMES",
			"MANAGE_ROLES"
		];

		const myPerms = message.channel.permissionsFor(message.guild.me);
		const perms = Object.keys(Discord.Permissions.FLAGS);

		let description = "";

		perms.forEach(perm => {
			if (requiredPerms.filter(p => p === perm).length > 0) {
				if (myPerms.has(perm)) description += `${bot.config.emojis.success} ${perm}\n`;
				else description += `${bot.config.emojis.error} ${perm}\n`;
			}
		});

		embed
			.setDescription(description)
			.setThumbnail(message.guild.iconURL({ dynamic: true, format: "png" }))
			.setFooter({
				text: `SparkV's permissions in this server. • ${bot.config.embed.footer}`,
				iconURL: bot.user.displayAvatarURL()
			})
			.setColor(bot.config.embed.color);
	} else if (type === "credits") {
		const Credits = [
			{
				name: await message.translate("**🛠 | Developers**"),
				value: "The people who made SparkV!\n\n**KingCh1ll** - Head Developer\n**Qu1ckly_Frost** - Developer",
				inline: true
			},
			{
				name: await message.translate("**✨ | Contributors**"),
				value: `${await message.translate(
					"People that have contributed to "
				)}SparkV.\n\n**2Lost4Discord** - ${await message.translate("Getting the bot verified.")}`,
				inline: true
			}
		];

		embed
			.setTitle(await message.translate("Credits"))
			.setDescription(await message.translate(`Here's the list of people who've helped SparkV to where he is now.`))
			.setColor(bot.config.embed.color)
			.setThumbnail(message.user.displayAvatarURL({ dynamic: true, format: "gif" }))
			.addFields(Credits);
	} else if (type === "rules") {
		const rules = [
			"No Automation. Using automation (Ex: auto-typers) is forbidden. Using automation (and with found proof) will cause a wipe of your data and a ban from using SparkV.",
			"No spamming commands. Spamming SparkV's commands will result with a warning. If continued, a complete wipe of your data and a ban from SparkV will be given to you.",
			"No using alternate accounts to earn yourself money. If proof is found, your data will be wiped and you will be banned from SparkV."
		];

		let description = "";
		let number = 0;
		rules.forEach(rule => {
			number++;
			description += `**${number}.** ${rule}\n`;
		});

		embed
			.setDescription(`**Rules**\n*Here's a simple list of rules for SparkV.*\n\n${description}`)
			.setColor(bot.config.embed.color);
	} else if (type === "website") {
		embed
			.setDescription(
				`**Hi, ${message.user.tag}!**\nClick [${await message.translate("here")}](https://${
					process.env.BASEURL
				}/) to view my website.`
			)
			.setColor("GREEN");
	}

	await message.replyT({
		embeds: [embed]
	});
}

export default new cmd(execute, {
	description: "Information for SparkV.",
	dirname: __dirname,
	usage: "",
	aliases: [],
	perms: [],
	slash: true,
	options: [
		{
			type: 3,
			name: "type",
			description: "The type of information you want to get about the bot.",
			required: true,
			choices: [
				{
					name: "credits",
					value: "credits"
				},
				{
					name: "permissions",
					value: "permissions"
				},
				{
					name: "rules",
					value: "rules"
				},
				{
					name: "website",
					value: "website"
				}
			]
		}
	]
}
);
